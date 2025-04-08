import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
        }

        const { nickname } = await req.json()

        if (!nickname || nickname.trim() === '') {
            return NextResponse.json({ error: '닉네임을 입력하세요.' }, { status: 400 })
        }

        const userId = parseInt(session.user.id)

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { nickname },
        })

        return NextResponse.json({
            message: '닉네임이 변경되었습니다.',
            user: updatedUser,
        })
    } catch (err) {
        console.error('[닉네임 변경 오류]', err) // 🔍 로그 확인에 도움됨
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}
