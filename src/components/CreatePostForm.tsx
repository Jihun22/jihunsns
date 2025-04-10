// src/components/CreatePostForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePostForm() {
    const [content, setContent] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        })

        if (res.ok) {
            setContent('')
            router.push('/')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full border p-2"
      />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">게시글 등록</button>
        </form>
    )
}
