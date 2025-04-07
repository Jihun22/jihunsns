import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import LogoutButton from "@/components/LogoutButton";

export default async function Page() {
    const session = await getServerSession(authOptions)
    console.log('세선졍보 ', session);
    return (
        <div className="p-4">
            {session?.user ? (
                <>
                <p>안녕하세요, {session.user.name}님 (ID: {session.user.id})</p>
                    <LogoutButton />      {/*로그아웃 버튼 */}
                    <Link href="/profile" className="text-blue-500 underline">
                        프로필 보기
                    </Link>

                </>
            ) : (
                <div>
                <p className={"mb-2"}>로그인이 필요합니다. </p>
                <Link
                href ="login"
                className ="inline-block bg-blue-500 text-white px-4 px-2 rounded">
                로그인 하러가기
                </Link>
                </div>
            )}
        </div>
    )

}
