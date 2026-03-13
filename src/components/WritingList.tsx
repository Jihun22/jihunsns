"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";
import type { AppUser } from "@/types/auth";
import { formatAuthorName } from "@/lib/author";
import { resolveImageUrl } from "@/lib/image";


// ✅ 타입 정의
interface ImageInfo {
  id: number;
  url: string;
}

interface AuthorInfo {
  id: number;
  nickname?: string;
  username?: string;
  email?: string;
}

interface LikeInfo {
  userId: number;
}

interface PostInfo {
  id: number;
  content: string;
  createdAt: string;
  author?: AuthorInfo;
  images?: ImageInfo[];
  likes?: LikeInfo[];
}

// ✅ 공통 API 응답 타입 (Spring ApiResponse)
type ApiResponse<T> = {
  code: string;
  message?: string;
  data: T;
};

// ✅ 페이지네이션 응답 형태 대응 (PageResponse)
type PageData<T> = {
  items?: T[];
  content?: T[];
};

export default function WritingList() {
  const [me, setMe] = useState<AppUser | null>(null);
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.BACKEND_URL ??
    "http://localhost:8080";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const baseUrl = apiBase;
        const token = localStorage.getItem("accessToken");
        const authHeaders: Record<string, string> = token
            ? { Authorization: `Bearer ${token}` }
            : {};
        // 현재 로그인 유저
        if (token) {
          const meRes = await fetch(`${baseUrl}/api/user/me`, {
            headers: authHeaders,
            cache: "no-store",
          });

          if (meRes.ok) {
            const raw: unknown = await meRes.json();
            const candidate =
              raw && typeof raw === "object" && "data" in raw ? (raw as { data?: unknown }).data : raw;
            const parsed =
              candidate && typeof candidate === "object" && "id" in candidate
                ? (candidate as AppUser)
                : null;
            if (mounted) setMe(parsed);
          } else if (mounted) {
            setMe(null);
          }
        } else if (mounted) {
          setMe(null);
        }

        // 게시글 목록
        const res = await fetch(`${baseUrl}/api/posts`, {
          headers: authHeaders,
          cache: "no-store",
        });
        if (!res.ok) return;

        // ✅ /api/posts 는 ApiResponse + (페이지네이션일 수 있음) 형태로 내려올 수 있음
        const json = (await res.json()) as ApiResponse<PostInfo[] | PageData<PostInfo>>;
        const raw = json?.data;

        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)
            ? raw.items
            : Array.isArray(raw?.content)
              ? raw.content
              : [];

        // ✅ 최신글이 위로 오도록 createdAt 기준 내림차순 정렬
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (mounted) setPosts(sorted);
      } catch {
        // console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  return (
    <div className="mt-6 space-y-4">
      {Array.isArray(posts) && posts.map(post => (
        <div key={post.id} className="border p-4 rounded shadow-sm hover:bg-gray-50 cursor-pointer">
          {/* ✅ Link 태그를 카드 전체로 적용 */}
          <Link href={`/post/${post.id}`} className="block">
            <p className="text-sm text-gray-500">{formatAuthorName(post.author)}</p>
            <p>{post.content}</p>

            {/* ✅ 이미지 표시 */}
            {post.images && post.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {post.images.map(img => {
                  const imageSrc = resolveImageUrl(img.url, apiBase);
                  if (!imageSrc) return null;
                  return (
                    <div key={img.id} className="relative w-32 h-24">
                      <Image
                        src={imageSrc}
                        alt="첨부 이미지"
                        fill
                        className="object-cover rounded border"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
          </Link>

          {/* ✅ 좋아요 버튼 */}
          <div className="mt-2">
            <LikeButton
              postId={String(post.id)}
              initialLiked={!!(me && post.likes?.some(like => like.userId === Number(me.id)))}
              initialCount={post.likes?.length || 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
