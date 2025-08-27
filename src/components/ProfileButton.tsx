"use client";

import { useRouter } from "next/navigation";

export default function ProfileButton() {
  const router = useRouter(); // ✅ useRouter 호출

  return (
    <button
      onClick={() => router.push("http://localhost:8080/profile")}
      className="mt-4 text-blue-600 underline hover:text-blue-800"
    >
      프로필
    </button>
  );
}
