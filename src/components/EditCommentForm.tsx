'use client'

import { useState } from 'react'

export default function EditCommentForm({ commentId, initialContent, onFinish }: {
    commentId: number
    initialContent: string
    onFinish?: () => void
}) {
    const [content, setContent] = useState(initialContent)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch(`/api/comment/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        })

        const result = await res.json()
        if (res.ok) {
            setMessage('수정 완료')
            onFinish?.()
        } else {
            setMessage(result.error || '수정 실패')
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
      />
            <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
                {loading ? '수정 중...' : '댓글 수정'}
            </button>
            {message && <p className="text-sm text-green-600">{message}</p>}
        </form>
    )
}
