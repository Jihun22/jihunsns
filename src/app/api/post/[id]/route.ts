import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs, { writeFile } from "fs/promises";
import { prisma } from "@/lib/prisma";

// PATCH: 게시글 수정
// @ts-expect-error nextjs타입시스템 충돌방지
export async function PATCH(req: NextRequest, context) {
  const formData = await req.formData();
  const content = formData.get("content")?.toString();
  const id = Number(context.params.id);
  const images = formData.getAll("image") as File[];

  if (!content || isNaN(id)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const updated = await prisma.post.update({
    where: { id },
    data: { content },
  });

  // 기존 이미지 제거
  await prisma.image.deleteMany({ where: { postId: id } });

  // 새 이미지 업로드
  if (images.length > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const ext = path.extname(image.name);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const uploadPath = path.join(uploadDir, fileName);

      await writeFile(uploadPath, buffer);

      await prisma.image.create({
        data: {
          url: `/uploads/${fileName}`,
          postId: id,
        },
      });
    }
  }

  return NextResponse.json(updated);
}

// GET: 게시글 단건 조회
// @ts-expect-error nextjs타입시스템 충돌방지
export async function GET(req: NextRequest, context) {
  const id = Number(context.params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!post) {
    return NextResponse.json({ error: "게시글 없음" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// DELETE: 게시글 + 이미지 삭제
// @ts-expect-error nextjs타입시스템 충돌방지
export async function DELETE(req: NextRequest, context) {
  const id = Number(context.params.id);

  // 댓글 먼저 삭제
  await prisma.comment.deleteMany({ where: { postId: id } });

  // 이미지 삭제
  await prisma.image.deleteMany({ where: { postId: id } });

  // 게시글 삭제
  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ message: "삭제 성공" });
}
