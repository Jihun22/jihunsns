// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import type { AppUser } from "@/types/auth";
import { headers, cookies } from "next/headers";

// ✅ 현재 로그인 유저 가져오기
async function getCurrentUser(): Promise<AppUser | null> {
    try {
        const backendUrl = process.env.BACKEND_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:8080";
        const res = await fetch(`${backendUrl}/api/auth/me`, {
            headers: {
                cookie: cookies().toString(),
            },
            cache: "no-store",
        });
        if (!res.ok) return null;
        return (await res.json()) as AppUser;
    } catch {
        return null;
    }
}

export default async function AdminPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login"); // 로그인 안 했으면 로그인 페이지로
    }

    if (user.role !== "ADMIN") {
        redirect("/"); // 로그인은 했지만 관리자가 아니면 홈으로
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">관리자 페이지</h1>
            <p>안녕하세요, {user.nickname}님!</p>
        </div>
    );
}
