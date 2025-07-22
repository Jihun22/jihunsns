import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";

// @ts-expect-error nextjs타입시스템 충돌방지
export async function GET(req: NextRequest, context) {
  const { filename } = context.params;

  try {
    const decodedFileName = decodeURIComponent(filename);

    // 1. DB에서 이미지 레코드 조회
    const image = await prisma.image.findFirst({
      where: {
        url: {
          endsWith: decodedFileName,
        },
      },
    });

    if (!image) {
      return new NextResponse("DB에 이미지 정보가 없습니다.", { status: 404 });
    }

    // 2. 파일 경로 재구성
    const uploadDir = path.join(process.cwd(), "public");
    const filePath = path.join(uploadDir, image.url);

    const imageBuffer = await fs.readFile(filePath);
    const fileExt = path.extname(decodedFileName).toLowerCase();

    const contentType =
      fileExt === ".png"
        ? "image/png"
        : fileExt === ".jpg" || fileExt === ".jpeg"
          ? "image/jpeg"
          : fileExt === ".webp"
            ? "image/webp"
            : "application/octet-stream";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    console.error("[이미지 제공 오류]", err);
    return new NextResponse("이미지 제공 중 오류 발생", { status: 500 });
  }
}
