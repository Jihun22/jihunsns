"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";
import type { AppUser } from "@/types/auth";

// ✅ 타입 정의
interface ImageInfo {
  id: number;
  url: string;
}

interface AuthorInfo {
  id: number;
  nickname: string;
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

export default function WritingList() {
  const [me, setMe] = useState<AppUser | null>(null);
  const [posts, setPosts] = useState<PostInfo[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 현재 로그인 유저
        const meRes = await fetch("/api/me", { credentials: "include", cache: "no-store" });
        const meData = meRes.ok ? ((await meRes.json()) as AppUser) : null;
        if (mounted) setMe(meData);

        // 게시글 목록
        const res = await fetch("/api/posts", { credentials: "include", cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as PostInfo[];
        if (mounted) setPosts(data);
      } catch {
        // 생략: 에러 처리 필요 시 추가
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-6 space-y-4">
      {posts.map(post => (
        <div key={post.id} className="border p-4 rounded shadow-sm hover:bg-gray-50 cursor-pointer">
          {/* ✅ Link 태그를 카드 전체로 적용 */}
          <Link href={`/post/${post.id}`} className="block">
            <p className="text-sm text-gray-500">{post.author?.nickname}</p>
            <p>{post.content}</p>

            {/* ✅ 이미지 표시 */}
            {post.images && post.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {post.images.map(img => (
                  <div key={img.id} className="relative w-32 h-24">
                    <Image
                      src={img.url}
                      alt="첨부 이미지"
                      fill
                      className="object-cover rounded border"
                    />
                  </div>
                ))}
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
