"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SignupButton from "@/components/SignupButton";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });



            const data = await res.json(); // ✅ 한 번만 실행

            console.log("✅ 로그인 응답:", data);

            if (res.ok && data.code === "S001" && data.data?.accessToken) {
                // ✅ 토큰 저장
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);

                console.log("✅ 로그인 성공, 토큰 저장 완료");
                router.push("/"); // 홈 이동
            } else {
                setMessage(data?.message || "로그인 실패");
            }
        } catch (err) {
            console.error("❌ 로그인 중 오류:", err);
            setMessage("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">로그인</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    로그인
                </button>
                <SignupButton />
            </form>
            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </div>
    );
}