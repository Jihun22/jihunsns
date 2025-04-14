// app/post/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface Props {
    params: { id: string }
}

export default async function PostDetailPage({ params }: Props) {
    const post = await prisma.post.findUnique({
        where: { id: Number(params.id) },
        include: { author: true },
    })

    if (!post) {
        notFound() // 404
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-bold">게시글 상세</h1>
            <p className="text-sm text-gray-500">작성자: {post.author.nickname}</p>
            <p className="text-base">{post.content}</p>
            <p className="text-xs text-gray-400">
                작성일: {new Date(post.createdAt).toLocaleString()}
            </p>
        </div>
    )
}
