// src/app/post/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BackButton from "@/components/BackButton";
import PostDetailClient from "@/components/PostDetailClient";

type Props = {
    params: { id: string }
}

export default async function PostDetailPage({params}: Props) {
    const id = Number(params.id)
    if (isNaN(id)) return notFound()

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: true,
            images: true,
            comments: {
                include : {author :true},
                orderBy : {createdAt:'desc'},
            }
        }
    })



    if (!post) return notFound()

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-2">게시글 상세</h1>
            <p className="text-gray-500">작성자: {post.author?.nickname}</p>


             <PostDetailClient post={post} />

            {/*<p className="my-4">{post.content}</p>*/}

            {/*/!* 이미지 출력 영역 *!/*/}
            {/*{post.images?.length > 0 && (*/}
            {/*    <div className="flex flex-wrap gap-4 my-4">*/}
            {/*        {post.images.map((img) => (*/}
            {/*            <img*/}
            {/*                key={img.id}*/}
            {/*                src={encodeURI(img.url)}*/}
            {/*                alt="첨부 이미지"*/}
            {/*                className="w-64 h-auto rounded border"*/}
            {/*            />*/}
            {/*        ))}*/}
            {/*    </div>*/}

            {/*)}*/}



            <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
            </p>

            <BackButton />
        </div>
    )
}
