// src/lib/auth-helpers.ts
import type { AppUser } from "@/types/auth";
export const isAdmin = (u?: AppUser | null) => u?.role === "ADMIN";