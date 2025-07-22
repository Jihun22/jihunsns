"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", nickname: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkDuplicate = async (email: string, nickname: string) => {
    const res = await fetch("/api/user/check-nickname", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nickname }),
    });
    if (!res.ok) {
      throw new Error("중복 검사 실패");
    }
    return await res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const duplicate = await checkDuplicate(form.email, form.nickname);

      if (duplicate.email) {
        setMessage("이미 사용중인 이메일");
        return;
      }
      if (duplicate.nickname) {
        setMessage("이미 사용중인 닉네임");
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("회원가입 성공!");
        router.push("/login");
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.log("중복검사 오류", err);
      setMessage("중복검사 오류");
    }
  };
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="nickname"
          placeholder="닉네임"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          가입하기
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}
