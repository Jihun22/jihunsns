import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const { nickname } = await req.json()

    if (!nickname || nickname.trim() === '') {
        return NextResponse.json({ error: '닉네임을 입력해주세요.' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
        where: { nickname },
    })

    if (existing) {
        return NextResponse.json({ exists: true }, { status: 200 })
    } else {
        return NextResponse.json({ exists: false }, { status: 200 })
    }
}
