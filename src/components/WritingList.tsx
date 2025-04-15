'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from "next/link";

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
            {posts.map((post: any) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                    <div className="border p-4 rounded shadow-sm hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-500">{post.author?.nickname}</p>
                    <p>{post.content}</p>

                    {/* ✅ 이미지 표시 */}
                    {post.images?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                            {post.images.map((img: any) => (
                                <img
                                    key={img.id}
                                    src={encodeURI(img.url)}
                                    alt="첨부 이미지"
                                    className="w-32 h-auto border rounded"
                                />
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
                </Link>
            ))}
        </div>
    )
}