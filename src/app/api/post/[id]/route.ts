import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs, { writeFile } from "fs/promises";
import { prisma } from "@/lib/prisma";

// PATCH: 게시글 수정
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const formData = await req.formData();
  const content = formData.get("content")?.toString();
  const { id } = await context.params;
  const numericId = Number(id);
  const images = formData.getAll("image") as File[];

  if (!content || isNaN(numericId)) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const updated = await prisma.post.update({
    where: { id: numericId },
    data: { content },
  });

  // 기존 이미지 제거
  await prisma.image.deleteMany({ where: { postId: numericId } });

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

      // @ts-ignore
      await prisma.image.create({
        data: {
          url: `/uploads/${fileName}`,
          postId: numericId,
          data: buffer,
          mimeType: image.type || "application/octet-stream",
        },
      });
    }
  }

  return NextResponse.json(updated);
}

// GET: 게시글 단건 조회
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);
  const post = await prisma.post.findUnique({
    where: { id: numericId },
    include: { images: true },
  });

  if (!post) {
    return NextResponse.json({ error: "게시글 없음" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// DELETE: 게시글 + 이미지 삭제
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);

  // 댓글 먼저 삭제
  await prisma.comment.deleteMany({ where: { postId: numericId } });

  // 이미지 삭제
  await prisma.image.deleteMany({ where: { postId: numericId } });

  // 게시글 삭제
  await prisma.post.delete({ where: { id: numericId } });

  return NextResponse.json({ message: "삭제 성공" });
}
