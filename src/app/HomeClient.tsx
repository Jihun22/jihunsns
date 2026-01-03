"use client";

import type { AppUser } from "@/types/auth";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import ProfileButton from "@/components/ProfileButton";
import WritingListButton from "@/components/WritingListButton";
import AdminButton from "@/components/AdminButton";

export default function HomeClient({ user: initialUser }: { user: AppUser | null }) {
    const [user, setUser] = useState<AppUser | null>(initialUser);
    const [loading, setLoading] = useState<boolean>(!initialUser);
    const router = useRouter();

    // 중복 호출 방지
    const inFlight = useRef(false);

    const fetchMe = async (reason: string) => {
        if (inFlight.current) return;
        inFlight.current = true;

        try {
            const token = localStorage.getItem("accessToken");
            console.log(`[HomeClient] fetchMe(${reason}) token?`, !!token);

            if (!token) {
                setUser(null);
                setLoading(false);
                router.replace("/login");
                return;
            }

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me`;
            const r = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });

            // ✅ 실패 원인을 바로 확인 가능하게 로그
            console.log("[HomeClient] /api/me status:", r.status);

            // r.json()이 HTML에서 터지는 케이스 방지용
            const text = await r.text();
            console.log("[HomeClient] /api/me body head:", text.slice(0, 80));

            let json: any = null;
            try {
                json = text ? JSON.parse(text) : null;
            } catch {
                json = null;
            }

            if (r.ok && json?.data) {
                setUser(json.data as AppUser);
                setLoading(false);
                return;
            }

            // ✅ 401/403만 로그인으로 보냄 (그 외는 로딩/에러로 남겨두기)
            if (r.status === 401 || r.status === 403) {
                setUser(null);
                setLoading(false);
                router.replace("/login");
                return;
            }

            // 기타 오류(500 등)는 로그인으로 튕기지 말고 유지
            setLoading(false);
        } catch (e) {
            console.error("[HomeClient] fetchMe error:", e);
            setLoading(false);
        } finally {
            inFlight.current = false;
        }
    };

    // 1) 최초 진입 시 user 없으면 1회 호출
    useEffect(() => {
        if (!user) fetchMe("mount");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2) 같은 페이지(/)에서 로그인 성공 이벤트 수신
    useEffect(() => {
        const onAuthUpdated = () => fetchMe("event");
        window.addEventListener("auth:updated", onAuthUpdated);
        return () => window.removeEventListener("auth:updated", onAuthUpdated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3) ✅ 이벤트가 안 와도 토큰 생기면 자동 감지 (짧은 폴링)
    // - /에서 로그인할 때 제일 확실히 해결됨
    useEffect(() => {
        const id = window.setInterval(() => {
            if (user) return; // 이미 로그인 완료면 중단 효과
            const token = localStorage.getItem("accessToken");
            if (token) fetchMe("poll");
        }, 500);

        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (loading && !user) return <div className="p-4">로딩중...</div>;
    if (!user) return <div className="p-4">로그인이 필요합니다. /login으로 이동합니다...</div>;

    return (
        <div className="min-h-screen p-4">
            <div className="w-full flex justify-end items-center space-x-2 mb-4">
                <Link href="/create-post" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    ✍️ 글쓰기
                </Link>
                <LogoutButton />
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-lg font-semibold">
                    {(user.nickname ?? user.email ?? "사용자")}님 환영합니다! (ID: {user.id})
                </p>
                <ProfileButton />
            </div>

            <WritingListButton />
            <AdminButton />
        </div>
    );
}