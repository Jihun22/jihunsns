"use client";

import { useEffect, useState } from "react";
import HomeClient from "./HomeClient";
import LoginPage from "./login/page";

export default function HomePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log("✅ HomePage accessToken:", token);

        if (!token) {
            setLoading(false);
            return;
        }

        // ✅ 토큰이 생겼을 때 즉시 /api/user/me 호출
        fetch("http://localhost:8080/api/user/me", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
        })
            .then(async (res) => {
                console.log("🟡 /me status:", res.status);
                const data = await res.json().catch(() => ({}));
                console.log("🟢 /me response:", data);

                if (res.ok && data.code === "S001") {
                    setUser(data.data);
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []); // ✅ 의존성 배열 비워서 최초 1회만 실행

    if (loading) return <p>로딩 중...</p>;
    if (!user) return <LoginPage />;

    return <HomeClient user={user} />;
}