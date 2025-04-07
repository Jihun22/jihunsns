import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    // ❌ 로그인 안 했으면 로그인 페이지로 이동
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">내 프로필</h1>
            <div className="space-y-2">
                <p><strong>이메일:</strong> {session.user.email}</p>
                <p><strong>닉네임:</strong> {session.user.name}</p>
                <p><strong>ID:</strong> {session.user.id}</p>
            </div>
        </div>
    )
}
