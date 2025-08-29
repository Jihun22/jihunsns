
"use client";
import type { AppUser } from "@/types/auth";
import BackButton from "@/components/BackButton";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePageClient({ user }: { user: AppUser }) {
    const [nickname, setNickname] = useState(user.nickname);
    const [message, setMessage] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [saving, setSaving] = useState(false);

    const router = useRouter();
    const NICK_RE = /^[A-Za-z0-9가-힣._-]{2,20}$/; // 영문/숫자/한글/._- 허용, 2~20자

    const onSave = async () => {
        const next = nickname.trim();
        if (!next) {
            setMessage("닉네임을 입력하세요.");
            return;
        }
        if (next === user.nickname) {
            setMessage("기존 닉네임과 동일합니다.");
            return;
        }
        if (!NICK_RE.test(next)) {
            setMessage("닉네임은 2~20자, 영문/숫자/한글/._-만 사용할 수 있어요.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            // 닉네임 중복 검사
            const dupRes = await fetch("/api/user/check-nickname", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nickname: next }),
            });
            const dup = dupRes.ok ? await dupRes.json() : { exists: true };
            if (dup?.exists) {
                setMessage("이미 사용중인 닉네임입니다.");
                setSaving(false);
                return;
            }

            // 닉네임 변경
            const res = await fetch("/api/user/nickname", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nickname: next }),
            });

            if (res.ok) {
                setMessage("닉네임 변경 완료!");
                // 로컬 상태 반영
                setNickname(next);
                // 서버 상태 갱신
                startTransition(() => {
                    router.refresh();
                });
            } else {
                const data = await res.json().catch(() => ({}));
                setMessage(data?.error || data?.message || "닉네임 변경 실패");
            }
        } catch {
            setMessage("닉네임 변경 실패");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">내 프로필</h1>
            <div className="space-y-2">
                <p>
                    <strong>이메일:</strong> {user.email}
                </p>
                <p>
                    <strong>닉네임:</strong> {nickname}
                </p>
                <p>
                    <strong>ID:</strong> {String(user.id)}
                </p>
                <p>
                    <strong>권한:</strong> {user.role}
                </p>
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => { setNickname(e.target.value); if (message) setMessage(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") onSave(); }}
                    className="border p-2 w-full"
                    placeholder="새 닉네임"
                    disabled={saving || isPending}
                    aria-label="닉네임 입력"
                    autoComplete="nickname"
                />
                <button
                    onClick={onSave}
                    disabled={saving || isPending}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-busy={saving || isPending}
                >
                    {saving || isPending ? "저장 중..." : "닉네임 수정"}
                </button>
            </div>

            {message && <p className="text-sm text-green-600">{message}</p>}

            <BackButton />
        </div>
    );
}