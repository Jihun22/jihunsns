import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, nickname, password } = await req.json();

  // 중복 체크
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "중복된 이메일입니다." }, { status: 400 });
  }

  //password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  //사용사 생성
  const user = await prisma.user.create({
    data: { email, nickname, password: hashedPassword },
  });

  return NextResponse.json({ message: "회원가입 성공 ", userId: user.id });
}
