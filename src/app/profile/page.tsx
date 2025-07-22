import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient"; // ✅ 클라이언트 컴포넌트 import

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <ProfilePageClient />; // ✅ 클라이언트 컴포넌트 렌더링
}
