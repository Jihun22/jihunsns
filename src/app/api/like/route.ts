import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { postId } = await req.json();
    const userId = parseInt(session.user.id);

    // 기존 좋아요 여부 확인
    const existing = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId,
                postId: Number(postId), // ✅ Int로 변환
            },
        },
    });

    if (existing) {
        // 좋아요 삭제
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId: Number(postId), // ✅ Int로 변환
                },
            },
        });
        return NextResponse.json({ liked: false });
    } else {
        // 좋아요 추가
        await prisma.like.create({
            data: {
                userId: userId,
                postId: Number(postId), // ✅ Int로 변환
            },
        });
        return NextResponse.json({ liked: true });
    }
}
