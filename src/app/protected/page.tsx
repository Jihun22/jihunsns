import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        // ✅ 로그인 안 되어 있으면 /login으로 리디렉션
        redirect('/login')
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">보호된 페이지</h1>
            <p>안녕하세요, {session.user.name}님!</p>
        </div>
    )
}
