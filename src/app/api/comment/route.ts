// src/app/api/comment/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { content, postId } = await req.json();

    if (!content || !postId) {
        return NextResponse.json({ error: '내용과 게시글 ID가 필요합니다.' }, { status: 400 });
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId: Number(postId),
                authorId: parseInt(session.user.id),
            },
            include: { author: true },
        });

        return NextResponse.json(newComment);
    } catch (error) {
        console.error('[댓글 작성 오류]:', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const postId = Number(searchParams.get('postId'));

    if (!postId) {
        return NextResponse.json({ error: 'postId 쿼리 파라미터가 필요합니다.' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: {
                    select: {
                        id: true,
                        nickname: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('[댓글 조회 오류]:', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}
