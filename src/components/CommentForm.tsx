'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function CommentForm({postId, onSuccess,}: {
    postId: number
    onSuccess?: () => void
}) {
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/comment`, {
                method: 'POST',
                body: JSON.stringify({content,postId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) {
                throw new Error('댓글 작성 실패')
            }

            setContent('')
            onSuccess?.()
        } catch (error) {
            console.error(error)
            alert('댓글 작성에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="댓글을 입력하세요"
                rows={3}
            />
            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
                {isLoading ? '작성 중...' : '댓글 작성'}
            </button>
        </form>
    )
}