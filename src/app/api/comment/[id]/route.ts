// src/app/api/comment/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ✅ Context 타입 명시적으로 정의
interface Context {
    params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Context) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    const id = Number(params.id);
    const { content } = await req.json();

    if (!content || isNaN(id)) {
        return NextResponse.json({ error: '유효하지 않은 요청' }, { status: 400 });
    }

    try {
        const updated = await prisma.comment.update({
            where: { id },
            data: { content },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[댓글 수정 오류]', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        await prisma.comment.delete({
            where: { id: parseInt(id, 10) }, // 숫자형 id 처리
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
