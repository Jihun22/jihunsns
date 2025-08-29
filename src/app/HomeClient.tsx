"use client";

import type { AppUser } from "@/types/auth";
import LogoutButton from "@/components/LogoutButton";
import ProfileButton from "@/components/ProfileButton";
import Link from "next/link";
import WritingListButton from "@/components/WritingListButton";
import AdminButton from "@/components/AdminButton";
import LoginPage from "@/app/login/page";

export default function HomeClient({ user }: { user: AppUser | null }) {
  // NextAuth 제거: 세션 대신 서버에서 주입된 사용자 정보(AppUser)를 사용
  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen p-4">
      {/* 우측 상단 버튼 영역 */}
      <div className="w-full flex justify-end items-center space-x-2 mb-4">
        <Link
          href="/create-post"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ✍️ 글쓰기
        </Link>
        <LogoutButton />
      </div>

      {/* 중앙 영역 */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-lg font-semibold">
          {(user.nickname ?? user.email ?? "사용자")}님 환영합니다! (ID: {user.id})
        </p>
        <ProfileButton />
      </div>

      {/* 글 목록 */}
      <WritingListButton />

      {/* 관리자만 보이는 버튼 */}
      <AdminButton />
    </div>
  );
}
