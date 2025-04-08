import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient' // 👈 분리된 클라이언트 컴포넌트

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login')
    }

    return <HomeClient session={session} />
}
