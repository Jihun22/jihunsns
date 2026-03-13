const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, "");
const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

/**
 * 이미지 URL이 절대 경로가 아니라면 백엔드 호스트를 붙여서 반환한다.
 * - 백엔드 호스트는 NEXT_PUBLIC_API_BASE_URL -> NEXTAUTH_URL -> BACKEND_URL -> localhost 순으로 사용
 */
export const resolveImageUrl = (rawUrl?: string | null, baseUrl?: string) => {
  if (!rawUrl) return "";
  if (ABSOLUTE_URL_REGEX.test(rawUrl)) return rawUrl;

  const origin =
    baseUrl ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:8080";

  return `${normalizeOrigin(origin)}${normalizePath(rawUrl)}`;
};
