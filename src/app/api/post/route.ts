import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content || content.trim() === '') {
        return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 })
    }

    const newPost = await prisma.post.create({
        data: {
            content,
            authorId: parseInt(session.user.id),
        },
    })

    return NextResponse.json(newPost)
}
 export async  function GET() {
    const posts = await prisma.post.findMany({
        orderBy: {createdAt :'desc'},
        include: {author :true},
    })

     return NextResponse.json(posts)
 }