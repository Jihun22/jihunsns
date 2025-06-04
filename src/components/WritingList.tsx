'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LikeButton from '@/components/LikeButton';

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
    const { data: session } = useSession();
    const [posts, setPosts] = useState<PostInfo[]>([]);

    useEffect(() => {
        if (session?.user) {
            fetch('/api/post')
                .then((res) => res.json())
                .then((data: PostInfo[]) => setPosts(data));
        }
    }, [session]);

    return (
        <div className="mt-6 space-y-4">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="border p-4 rounded shadow-sm hover:bg-gray-50 cursor-pointer"
                >
                    {/* ✅ Link 태그를 카드 전체로 적용 */}
                    <Link href={`/post/${post.id}`} className="block">
                        <p className="text-sm text-gray-500">{post.author?.nickname}</p>
                        <p>{post.content}</p>

                        {/* ✅ 이미지 표시 */}
                        {post.images && post.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                                {post.images.map((img) => (
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

                        <p className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </Link>

                    {/* ✅ 좋아요 버튼 */}
                    <div className="mt-2">
                        <LikeButton
                            postId={String(post.id)}
                            initialLiked={!!post.likes?.some(
                                (like) => like.userId === Number(session?.user?.id) // 문자열 대비 숫자 변환 처리
                            )}
                            initialCount={post.likes?.length || 0}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
