// HomeClient.tsx
'use client' // ✅ 이거 없으면 에러 납니다!

import { signOut } from 'next-auth/react'
import LogoutButton from '@/components/LogoutButton'
import ProfileButton from "@/components/ProfileButton";

export default function HomeClient({ session }: { session: any }) {
    return (
        <div>
            <p>{session.user.name}님 환영합니다!(ID: {session.user.id})</p>

            <LogoutButton />
            <ProfileButton />

        </div>
    )
}
