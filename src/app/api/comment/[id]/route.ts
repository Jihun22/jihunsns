import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    const id = Number(context.params.id);
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
    req: NextRequest,
    context: { params: { id: string } }
) {
    const id = Number(context.params.id);

    try {
        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[댓글 삭제 오류]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
