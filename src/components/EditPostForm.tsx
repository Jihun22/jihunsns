'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
    postId: number
}

export default function EditPostForm({ postId }: Props) {
    const [content, setContent] = useState('')
    const [images, setImages] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([])
    const [message, setMessage] = useState('')
    const router = useRouter()

    useEffect(() => {
        // 기존 게시글 가져오기
        const fetchPost = async () => {
            const res = await fetch(`/api/post/${postId}`)
            const data = await res.json()
            setContent(data.content)
            setExistingImages(data.images || [])
        }
        fetchPost()
    }, [postId])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('content', content)
        images.forEach((img) => formData.append('image', img)) // ← image 필드명 일관

        const res = await fetch(`/api/post/${postId}`, {
            method: 'PATCH',
            body: formData,
        })

        const result = await res.json()
        if (res.ok) {
            setMessage('게시글이 수정되었습니다.')
            router.push(`/post/${postId}`) // ← 템플릿 문자열 수정
        } else {
            setMessage(result.error || '수정 실패')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용 수정..."
          className="w-full border p-2"
      />
            {/* 기존 이미지 보여주기 */}
            {existingImages.length > 0 && (
                <div className="flex gap-2">
                    {existingImages.map((img) => (
                        <img
                            key={img.id}
                            src={encodeURI(img.url)}
                            alt="기존 이미지"
                            className="w-32 h-auto border rounded"
                        />
                    ))}
                </div>
            )}

            {/* 이미지 재업로드 */}
            <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                이미지 선택
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                />
            </label>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                게시글 수정
            </button>

            {message && <p className="text-sm text-green-600">{message}</p>}
        </form>
    )
}
