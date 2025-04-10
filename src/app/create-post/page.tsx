// src/app/create-post/page.tsx
'use client'

import CreatePostForm from "@/components/CreatePostForm"

export default function CreatePostPage() {
    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>
            <CreatePostForm />
        </div>
    )
}
