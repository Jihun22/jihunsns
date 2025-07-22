import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, nickname }: { email?: string; nickname?: string } = await req.json();

  if (!email && !nickname) {
    return NextResponse.json({ error: "이메일 또는 닉네임이 필요합니다." }, { status: 400 });
  }

  const result: { email?: boolean; nickname?: boolean } = {};

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    result.email = Boolean(existingEmail);
  }

  if (nickname) {
    const existingNickname = await prisma.user.findUnique({ where: { nickname } });
    result.nickname = Boolean(existingNickname);
  }

  return NextResponse.json(result);
}
