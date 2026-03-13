"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!content.trim()) {
      setMessage("내용을 입력하세요.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    images.forEach((img) => formData.append("image", img)); // 서버 키가 image인지 확인!

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 없습니다.");

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization : `Bearer ${token}`} : undefined,
        // 인증/세션 쿠키 필요하면 아래 추가
        // credentials: "include",
      });

      const text = await res.text(); // ✅ 항상 text로 먼저 받기
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: "응답이 JSON이 아닙니다.", raw: text };
      }

      if (!res.ok) {
        setMessage(data.error || `등록 실패 (HTTP ${res.status})`);
        return;
      }

      alert("게시글이 등록되었습니다!");
      setContent("");
      setImages([]);
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setMessage("요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full border p-2"
      />

        <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
          이미지 선택
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </label>

        {images.length > 0 && (
            <div className="text-sm text-gray-700 space-y-1">
              {images.map((file, index) => (
                  <p key={index}>{file.name}</p>
              ))}
            </div>
        )}

        <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
        >
          {loading ? "등록 중..." : "게시글 등록"}
        </button>

        {message && <p className="text-red-600">{message}</p>}
      </form>
  );
}