"use client";

import { useRouter } from "next/navigation";

export default function SignupButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/signup")}
      className="bg-blue-500 text-white px-4 py-2  rounded mt-4 ml-2 transition"
    >
      회원가입
    </button>
  );
}
