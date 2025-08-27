// src/components/CreatePostForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  //✅글쓰기 폼
  const [content, setContent] = useState("");
  const router = useRouter();

  //✅이미지 관련
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false); // ✅ 수정

  //✅이미지 파일 선언
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("content", content);
    images.forEach(img => formData.append("image", img));

    try {
      const res = await fetch("http://localhost:8080/api/post", {
        method: "POST",
        body: formData,
      });

      interface ResultType {
        error?: string;
      }
      let result: ResultType = {};
      try {
        result = await res.json();
      } catch {
        result = { error: "응답 파싱 오류" };
      }

      if (res.ok) {
        alert("게시글이 등록되었습니다!");
        setContent("");
        setImages([]);
        router.push("/");
      } else {
        setMessage(result.error || "등록 실패");
      }
    } catch (error) {
      console.error("등록 중 오류:", error);
      setMessage("요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="내용을 입력하세요..."
        className="w-full border p-2"
      />
      {/* 이미지 업로드 */}
      <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
        이미지 선택
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
      {/* 선택한 파일 이름 목록 */}
      {images.length > 0 && (
        <div className="text-sm text-gray-700 space-y-1">
          {images.map((file, index) => (
            <p key={index}> {file.name}</p>
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
      {message && <p className="text-green-600"> {message} </p>}
    </form>
  );
}
