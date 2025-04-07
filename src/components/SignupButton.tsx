'use client'

import { signOut } from 'next-auth/react'

export default function SignupButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/signup' })}
            className="bg-blue-500 text-white px-4 py-2  rounded mt-4 ml-2 transition"
        >
            회원가입
        </button>
    )
}
