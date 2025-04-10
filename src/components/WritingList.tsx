'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function WritingList() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (session?.user) {
            fetch("/api/post")
                .then(res => res.json())
                .then(data => setPosts(data))
        }
    }, [session])

    return (
        <div className="mt-6 space-y-4">
            {posts.length === 0 ? (
                <p className="text-center text-gray-400">작성된 게시글이 없습니다.</p>
            ) : (
                posts.map((post: any) => (
                    <div key={post.id} className="border p-4 rounded shadow-sm">
                        <p className="text-sm text-gray-500">{post.author?.nickname}</p>
                        <p>{post.content}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    )
}
