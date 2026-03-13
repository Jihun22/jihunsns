// @ts-ignore

import { notFound } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";

export const dynamic = "force-dynamic";

interface AuthorDTO {
  id: number;
  nickname?: string;
  username?: string;
  email?: string;
}

interface PostDTO {
  id: number;
  content: string;
  createdAt: string;
  author?: AuthorDTO;
}

// ✅ 공통 응답 포맷 대응
interface ApiResponse<T> {
  code: string;
  message?: string;
  data?: T;
}

async function fetchPost(id: number): Promise<PostDTO | null> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.BACKEND_URL ??
    "http://localhost:8080";

  const res = await fetch(`${apiBase}/api/posts/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse<PostDTO> | PostDTO;
  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiResponse<PostDTO>).data ?? null;
  }
  return json as PostDTO;
}

export default async function Page({ params }: any) {
  const { id } = await params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return notFound();

  const post = await fetchPost(numericId);
  if (!post) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
      <EditPostForm postId={post.id} />
    </div>
  );
}
