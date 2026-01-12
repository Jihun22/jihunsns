"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 사용함

export default function CommentForm({
  postId,
  onSuccess,
}: {
  postId: number;
  onSuccess?: () => void;
}) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ✅ 사용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        process.env.NEXTAUTH_URL ??
        "http://localhost:8080";

    if (!content.trim()) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }


    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/comment`, {
        method: "POST",
        body: JSON.stringify({ content, postId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ JWT 전달
        },
      });

      if (!res.ok) throw new Error("댓글 작성 실패");

      setContent("");
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="댓글을 입력하세요"
        rows={3}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? "작성 중..." : "댓글 작성"}
      </button>
    </form>
  );
}
