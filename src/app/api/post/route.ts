import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs, { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const formData = await req.formData()
    const content = formData.get('content')?.toString()
    const images = formData.getAll('image') as File[]

    if (!content || content.trim() === '') {
        return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 })
    }

    // 게시글 DB에 먼저 저장
    const newPost = await prisma.post.create({
        data: {
            content,
            authorId: parseInt(session.user.id),
        },
    })

    // 이미지가 있다면 처리
    for (const image of images) {
        const buffer = Buffer.from(await image.arrayBuffer())
        const fileName = encodeURIComponent(image.name)

        const uploadDir = path.join(process.cwd(), 'public', 'uploads') // ✅ 절대 경로 지정
        const uploadPath = path.join(uploadDir, fileName)

        // 디렉토리 먼저 생성 (없으면 에러)
        await fs.mkdir(uploadDir, { recursive: true })

        // 파일 저장
        await writeFile(uploadPath, buffer)

        // DB 저장
        await prisma.image.create({
            data: {
                url: `/uploads/${fileName}`, // 프론트엔드에서 접근 가능한 경로
                postId: newPost.id,
            }
        })
    }

    return NextResponse.json({ message: '게시글 등록 성공', post: newPost })
}

export async function GET() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            images: true,
            likes: true,
        },
    })

    return NextResponse.json(posts)
}

