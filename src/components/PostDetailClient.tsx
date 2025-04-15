// src/components/PostDetailClient.tsx
'use client'
// 글 삭제 ,이미지 출력 컴포넌트  분리
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PostDetailClient({ post }: { post: any }) {
    const router = useRouter()

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
        </div>
    )
}
