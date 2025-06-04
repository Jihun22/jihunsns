import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 댓글 수정
// @ts-expect-error nextjs타입시스템 충돌방지
export async function PATCH(req: NextRequest, context) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '인증 필요' }, { status: 401 });
    }

    const id = parseInt(context.params.id, 10);
    const { content }: { content: string } = await req.json();

    if (!content || isNaN(id)) {
        return NextResponse.json({ error: '유효하지 않은 요청' }, { status: 400 });
    }

    const comment = await prisma.comment.findUnique({
        where: { id },
        select: { authorId: true },
    });

    if (!comment || comment.authorId !== parseInt(session.user.id, 10)) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const updated = await prisma.comment.update({
        where: { id },
        data: { content },
    });

    return NextResponse.json(updated);
}
