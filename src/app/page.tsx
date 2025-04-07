import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Page() {
    const session = await getServerSession(authOptions)
    console.log('세선졍보 ', session);
    return (
        <div>
            {session?.user ? (
                <p>안녕하세요, {session.user.name}님 (ID: {session.user.id})</p>
            ) : (
                <p>로그인이 필요합니다. </p>
            )}
        </div>
    )

}
