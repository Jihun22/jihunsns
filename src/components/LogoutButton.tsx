// src/components/LogoutButton.tsx
'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 transition"
        >
            로그아웃
        </button>
    )
}
