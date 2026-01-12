// src/components/AdminButton.tsx
"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/types/auth";
import Link from "next/link";

export default function AdminButton() {
  const [me, setMe] = useState<AppUser | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("accessToken");
        if (!token) {
          if (mounted) setMe(null);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const raw: unknown = res.ok ? await res.json() : null;
        const candidate = raw && typeof raw === "object" && "data" in raw ? (raw as { data?: unknown }).data : raw;
        const parsed =
          candidate && typeof candidate === "object" && "id" in candidate ? (candidate as AppUser) : null;
        if (mounted) setMe(parsed);
      } catch {
        if (mounted) setMe(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!me || me.role !== "ADMIN") return null;

  return (
    <Link href="/protected" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      관리자 페이지
    </Link>
  );
}
