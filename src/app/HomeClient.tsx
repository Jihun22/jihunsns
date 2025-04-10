// HomeClient.tsx
'use client'

import {useSession} from 'next-auth/react'
import LogoutButton from '@/components/LogoutButton'
import ProfileButton from "@/components/ProfileButton";
import {useEffect, useRef, useState} from "react";
import LoginPage from "@/app/login/page";
import CreatePostForm from "@/components/CreatePostForm";
import Link from "next/link";

export default function HomeClient() {
    const {data : session , status,update} = useSession()
    const refreshed = useRef(false) //무한루프 방지
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (!refreshed.current) {
            refreshed.current = true
            update() // 한번만 실행
        }
    }, [status,update])

    useEffect(() => {
        if (session?.user) {
            fetch("/api/post")
                .then(res => res.json())
            .then(data => setPosts(data))
        }
    }, [session]);

if (status == 'loading') return <p> 세션 로딩중 ..</p>

if (!session?.user) {
    return  <LoginPage/>

}
    return (
        <div className="min-h-screen p-4">
            {/* 우측 상단 버튼 영역 */}
            <div className="w-full flex justify-end items-center space-x-2 mb-4">
                <Link
                    href="/create-post"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    ✍️ 글쓰기
                </Link>

                <LogoutButton />
            </div>

            {/* 중앙 영역 */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-lg font-semibold">
                    {session.user.name}님 환영합니다! (ID: {session.user.id})
                </p>

                <ProfileButton />
            </div>
            {/* 글 목록 */}
            <div className="mt-6 space-y-4">
                {posts.length === 0? (
                    <p className="next-center text-gray-4000"> 작성된 게시글 없습니다. </p>
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
        </div>

    )
}
