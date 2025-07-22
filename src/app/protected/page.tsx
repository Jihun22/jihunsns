import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // 로그인 안 했으면 로그인 페이지로
  }

  if (session.user?.role !== "admin") {
    redirect("/"); // 로그인은 했지만 관리자가 아니면 홈으로
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">관리자 페이지</h1>
      <p>안녕하세요, {session.user.name}님!</p>
    </div>
  );
}
