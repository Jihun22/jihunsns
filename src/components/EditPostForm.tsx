"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";

type EditPostData = {
  content?: string;
  images?: { id: number; url: string }[];
};

type ApiEnvelope = {
  data?: unknown;
  message?: unknown;
  error?: unknown;
  raw?: unknown;
};

const parseJson = (text: string): unknown => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

const unwrapApiData = (payload: unknown): unknown => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope).data;
  }
  return payload;
};

const isEditPostData = (value: unknown): value is EditPostData => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const content = candidate.content;
  const images = candidate.images;

  const contentValid = content === undefined || typeof content === "string";
  const imagesValid =
    images === undefined ||
    (Array.isArray(images) &&
      images.every(
        (img) =>
          !!img &&
          typeof img === "object" &&
          typeof (img as { id?: unknown }).id === "number" &&
          typeof (img as { url?: unknown }).url === "string",
      ));

  return contentValid && imagesValid;
};

const extractServerMessage = (value: unknown): string | undefined => {
  if (value && typeof value === "object") {
    const envelope = value as ApiEnvelope;
    if (typeof envelope.message === "string") return envelope.message;
    if (typeof envelope.error === "string") return envelope.error;
    if (typeof envelope.raw === "string") return envelope.raw;
  } else if (typeof value === "string") {
    return value;
  }
  return undefined;
};

type Props = {
  postId: number;
};

export default function EditPostForm({ postId }: Props) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [message, setMessage] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.BACKEND_URL ??
    "http://localhost:8080";

  useEffect(() => {
    let active = true;
    setLoadingPost(true);
    setMessage("");

    (async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${apiBase}/api/posts/${postId}`, {
          headers,
          cache: "no-store",
        });

        const text = await res.text();
        const payload = parseJson(text);
        const data = unwrapApiData(payload);

        if (active && res.ok && isEditPostData(data)) {
          setContent(data.content ?? "");
          setExistingImages(data.images ?? []);
        } else if (active && !res.ok) {
          const errorMessage = extractServerMessage(data ?? payload);
          setMessage(errorMessage ?? "게시글 정보를 불러오지 못했습니다.");
        }
      } catch {
        if (active) setMessage("게시글 정보를 불러오지 못했습니다.");
      } finally {
        if (active) setLoadingPost(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [apiBase, postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    images.forEach(img => formData.append("image", img));

    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`${apiBase}/api/posts/${postId}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      const payload = parseJson(text);
      const errorMessage = extractServerMessage(payload);

      if (res.ok) {
        setMessage("게시글이 수정되었습니다.");
        router.push(`/post/${postId}`);
        router.refresh();
      } else {
        setMessage(errorMessage || "수정 실패");
      }
    } catch {
      setMessage("요청 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="내용 수정..."
        className="w-full border p-2"
        disabled={loadingPost || submitting}
      />

      {existingImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {existingImages.map(img => {
            const imageSrc = resolveImageUrl(img.url, apiBase);
            if (!imageSrc) return null;
            return (
              <div key={img.id} className="relative w-32 h-32">
                <Image
                  src={imageSrc}
                  alt="기존 이미지"
                  fill
                  className="object-cover rounded border"
                />
              </div>
            );
          })}
        </div>
      )}

      <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
        이미지 선택
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
          disabled={submitting}
        />
      </label>

      {images.length > 0 && (
        <div className="text-sm text-gray-700 space-y-1">
          {images.map((file, index) => (
            <p key={`${file.name}-${index}`}>{file.name}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loadingPost || submitting}
      >
        {submitting ? "수정 중..." : "게시글 수정"}
      </button>

      {loadingPost && <p className="text-sm text-gray-500">게시글 정보를 불러오는 중...</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
