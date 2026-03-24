"use client";

import Image from "next/image";
import { useState } from "react";

type Provider = "google" | "naver" | "kakao";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export default function SocialLoginButtons() {
  const [error, setError] = useState<string>("");

  const handleSocialLogin = (provider: Provider) => {
    if (typeof window === "undefined") return;
    setError("");

    try {
      const backend = trimTrailingSlash(API_BASE);
      const providerUrl = `${backend}/oauth2/authorization/${provider}`;

      window.location.href = providerUrl;
    } catch (err) {
      console.error(`[SocialLoginButtons] ${provider} redirect failed`, err);
      setError("소셜 로그인 준비 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-4 space-y-2 social-login-buttons">
      <p className="text-sm text-gray-500">또는 소셜 계정으로 로그인</p>
      <button type="button" className="social-button w-full" onClick={() => handleSocialLogin("google")} aria-label="Google 계정으로 로그인">
        <div className="social-image-wrapper">
          <Image
            src="/google-login-button.svg"
            alt="Google 계정으로 로그인"
            width={300}
            height={45}
            priority={false}
            className="google-button-img"
          />
        </div>
      </button>

      <button type="button" className="social-button w-full" onClick={() => handleSocialLogin("naver")} aria-label="네이버 계정으로 로그인">
        <div className="social-image-wrapper">
          <Image src="/NAVER_login_KR/NAVER_login_Dark_KR_green_wide_H56.png" alt="네이버 계정으로 로그인" width={300} height={45} priority={false} />
        </div>
      </button>

      <button type="button" className="social-button w-full" onClick={() => handleSocialLogin("kakao")} aria-label="카카오 계정으로 로그인">
        <div className="social-image-wrapper">
          <Image src="/kakao_login/ko/kakao_login_medium_wide.png" alt="카카오 계정으로 로그인" width={300} height={45} priority={false} />
        </div>
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <style jsx>{`
        .social-login-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .social-button {
          max-width: 300px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .social-image-wrapper {
          width: 300px;
          height: 45px;
          overflow: hidden;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-image-wrapper :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
