import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
        return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: true,
                images: true,
                comments: {
                    include: { author: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: "게시글 없음" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (err) {
        console.error("[게시글 조회 오류]", err);
        return NextResponse.json({ error: "게시글 조회 중 오류 발생" }, { status: 500 });
    }
}