// Helper utilities for displaying author-related information
export type AuthorLike = {
  id?: number | string;
  nickname?: string | null;
  username?: string | null;
  email?: string | null;
};

/**
 * Returns the best-effort display name for an author object.
 * 우선순위: nickname -> username -> email -> `유저#{id}` -> fallback
 */
export const formatAuthorName = (author?: AuthorLike, fallback = "익명"): string => {
  if (!author) return fallback;

  const nickname = typeof author.nickname === "string" ? author.nickname.trim() : "";
  if (nickname) return nickname;

  const username = typeof author.username === "string" ? author.username.trim() : "";
  if (username) return username;

  const email = typeof author.email === "string" ? author.email.trim() : "";
  if (email) return email;

  if (author.id !== undefined && author.id !== null) {
    return `유저#${author.id}`;
  }

  return fallback;
};
