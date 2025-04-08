'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import BackButton from '@/components/BackButton'

export default function ProfilePageClient() {
    const { data: session, status, update } = useSession()
    const [nickname, setNickname] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (session?.user?.name) {
            setNickname(session.user.name)
        }
    }, [session])

    const handleSubmit = async () => {
        const res = await fetch('/api/user/nickname', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname }),
        })

        const data = await res.json()
        if (res.ok) {
            setMessage('닉네임 변경 완료!')
            update()
        } else {
            setMessage(data.error || '닉네임 변경 실패')
        }
    }

    if (status === 'loading') return <p>세션 로딩 중...</p>

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">내 프로필</h1>
            <div className="space-y-2">
                <p><strong>이메일:</strong> {session?.user?.email}</p>
                <p><strong>닉네임:</strong> {session?.user?.name}</p>
                <p><strong>ID:</strong> {session?.user?.id}</p>
            </div>

            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-2 w-full"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                닉네임 수정
            </button>
            {message && <p className="text-sm text-green-600">{message}</p>}

            <BackButton />
        </div>
    )
}
