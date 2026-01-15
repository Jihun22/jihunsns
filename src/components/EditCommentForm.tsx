"use client";

import { useState } from "react";

export default function EditCommentForm({
  commentId,
  initialContent,
  onFinish,
}: {
  commentId: number;
  initialContent: string;
  onFinish?: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXTAUTH_URL ??
      "http://localhost:8080";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!content.trim()) {
      setMessage("내용을 입력해주세요.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }
    setLoading(true);

    const res = await fetch(`${apiBase}/api/comment/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
      cache: "no-cache",
    });

    const result = await res.json();
    if (res.ok) {
      setMessage("수정 완료");
      onFinish?.();
    } else {
      setMessage(result.error || "수정 실패");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
        {loading ? "수정 중..." : "댓글 수정"}
      </button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
