"use client";

import { useCallback, useEffect, useState } from "react";
import HomeClient from "./HomeClient";
import LoginPage from "./login/page";
import type { AppUser } from "@/types/auth";

export default function HomePage() {
    const [user, setUser] = useState<AppUser | null>(null);
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
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
            const res = await fetch(`${baseUrl}/api/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            console.log("🟡 /me status:", res.status);
            const data: unknown = await res.json().catch(() => null);
            console.log("🟢 /me response:", data);

            const rawUser = data && typeof data === "object" && "data" in data ? (data as { data: unknown }).data : data;
            const parsedUser =
                rawUser && typeof rawUser === "object" && "id" in rawUser
                    ? (rawUser as AppUser)
                    : null;

            if (res.ok && parsedUser) {
                setUser(parsedUser);
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
