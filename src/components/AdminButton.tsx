// src/components/AdminButton.tsx
"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/types/auth";
import Link from "next/link";

export default function AdminButton() {
  const [me, setMe] = useState<AppUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include", cache: "no-store" });
        const data = res.ok ? ((await res.json()) as AppUser) : null;
        setMe(data);
      } catch {
        setMe(null);
      }
    })();
  }, []);

  if (!me || me.role !== "ADMIN") return null;

  return (
    <Link href="/protected" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      관리자 페이지
    </Link>
  );
}
