// src/app/api/comment/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const id = Number(params.id)
    const { content } = await req.json()

    if (!content || !id) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    // 댓글 수정
    const updated = await prisma.comment.update({
        where: {
            id,
            authorId: Number(session.user.id), // 작성자 본인인지 확인
        },
        data: {
            content,
        },
    })

    return NextResponse.json(updated)
}
