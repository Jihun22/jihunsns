// src/components/AdminButton.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session?.user || session.user.role !== "admin") return null;

  return (
    <Link href="/protected" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
      관리자 페이지
    </Link>
  );
}
