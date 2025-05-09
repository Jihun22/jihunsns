// src/app/api/comment/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
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
    context: { params: Record<string, string> } // 💡 공식 타입 사용
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    const id = Number(context.params.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: '유효하지 않은 요청' }, { status: 400 });
    }

    try {
        const comment = await prisma.comment.findUnique({ where: { id } });

        if (!comment) {
            return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
        }

        if (comment.authorId !== Number(session.user.id)) {
            return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
        }

        await prisma.comment.delete({ where: { id } });

        return NextResponse.json({ message: '댓글 삭제 완료' });
    } catch (error) {
        console.error('[댓글 삭제 오류]:', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}
