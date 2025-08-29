// src/app/users/page.tsx
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic"; // 항상 서버 사이드 렌더링
type UserDTO = {
    id: number;
    email: string;
    nickname: string;
    role?: string;
};

async function getUsers(): Promise<UserDTO[]> {
    try {
        // ✅ 서버 컴포넌트에서는 프록시 라우트로 호출
        const res = await fetch("/api/users", {
            cache: "no-store",
            credentials: "include", // JWT 쿠키 전달
        });

        if (res.status === 404) return [];
        if (!res.ok) throw new Error("회원 목록 조회 실패");

        return (await res.json()) as UserDTO[];
    } catch (err) {
        console.error("회원 목록 불러오기 오류:", err);
        return [];
    }
}

export default async function UsersPage() {
    const users = await getUsers();

    if (!users || users.length === 0) {
        return notFound();
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">회원 목록</h1>
            <ul className="mt-2 space-y-1">
                {users.map((user) => (
                    <li key={user.id}>
                        {user.email} / {user.nickname}
                        {user.role && <span className="text-gray-500"> ({user.role})</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}