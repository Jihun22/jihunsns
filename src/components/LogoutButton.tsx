// LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/api/auth/login" })}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      로그아웃
    </button>
  );
}
