// HomeClient.tsx
'use client'

import {useSession} from 'next-auth/react'
import LogoutButton from '@/components/LogoutButton'
import ProfileButton from "@/components/ProfileButton";
import {useEffect, useRef} from "react";
import LoginPage from "@/app/login/page";

export default function HomeClient() {
    const {data : session , status,update} = useSession()
    const refreshed = useRef(false) //무한루프 방지

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
        <div>
            <p>{session.user.name}님 환영합니다!(ID: {session.user.id})</p>

            <LogoutButton />
            <ProfileButton />

        </div>
    )
}
