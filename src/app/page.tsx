"use client";

import { useCallback, useEffect, useState } from "react";
import HomeClient from "./HomeClient";
import LoginPage from "./login/page";

export default function HomePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const fetchMe = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        console.log("✅ HomePage accessToken:", token);

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            console.log("🟡 /me status:", res.status);
            const data = await res.json().catch(() => ({}));
            console.log("🟢 /me response:", data);

            if (res.ok && data.code === "S001") {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("❌ /me fetch error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    useEffect(() => {
        const handleAuthUpdated = () => {
            fetchMe();
        };
        window.addEventListener("auth:updated", handleAuthUpdated);
        return () => window.removeEventListener("auth:updated", handleAuthUpdated);
    }, [fetchMe]);

    if (loading) return <p>로딩 중...</p>;
    if (!user) return <LoginPage />;

    return <HomeClient user={user} />;
}
