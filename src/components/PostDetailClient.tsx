// src/components/PostDetailClient.tsx
'use client'
// 글 삭제 ,이미지 출력 컴포넌트  분리
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CommentForm from "@/components/CommentForm";

export default function PostDetailClient({ post}: { post: any }) {
    const router = useRouter()
    const [comments, setComments] = useState(post.comments || [])

    //댓글 작성후 바로 반영 로직
    const fetchComments = async () => {
        const res = await fetch(`/api/comment?postId=${post.id}`)
        const data = await res.json()
        setComments(data)
    }

    //삭제 로직
    const handleDelete = async () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const res = await fetch(`/api/post/${post.id}`, { method: 'DELETE' })
            if (res.ok) {
                router.push('/')
            } else {
                alert('삭제 실패')
            }
        }
    }


    return (
        <div>
            <p className="my-4">{post.content}</p>

            <button onClick={handleDelete} className="text-red-600 mr-2">🗑 삭제</button>
            <button onClick={() => router.push(`/post/${post.id}/edit`)} className="text-blue-600">
                ✏️ 수정
            </button>

            {/* 이미지 출력 */}
            {post.images?.length > 0 && (
                <div className="flex flex-wrap gap-4 my-4">
                    {post.images.map((img: any) => (
                        <Image
                            key={img.id}
                            src={encodeURI(img.url)}
                            alt="첨부 이미지"
                            width={256}
                            height={200}
                            className="rounded border"
                        />
                    ))}
                </div>
            )}
        {/*   댓글 영역 */}
            <div className="mt-6 space-y-2">
                <h2 className="text-lg font-semibold"> 댓글 </h2>

                {/* 댓글 작성 폼 */}
                <CommentForm postId={post.id} onSuccess={fetchComments}/>

                {/*댓글 목록 */}
                {comments.length ===0? (
                    <p className="text-sm text-gray-500"> 댓글이 없습니다. </p>
                ):(
                    comments.map((comment:any) => (
                    <div key={comment.id} className="border p-2 rounded">
                        <p className="text-sm text-gray-500">{comment.author.nickname}</p>
                        <p> {comment.content}</p>
                        <p className="text-xs text-gray-400"> {new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                    ))
                )}
            </div>
        </div>
    )
}
