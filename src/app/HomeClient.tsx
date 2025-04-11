// HomeClient.tsx
'use client'

import {useSession} from 'next-auth/react'
import LogoutButton from '@/components/LogoutButton'
import ProfileButton from "@/components/ProfileButton";
import {useEffect, useRef, useState} from "react";
import LoginPage from "@/app/login/page";
import Link from "next/link";
import WritingListButton from "@/components/WritingListButton";
import AdminButton from "@/components/AdminButton";

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
            <WritingListButton />
            {/*관리자만 보이는 버튼 */}
            <AdminButton />

                    </div>



    )
}
