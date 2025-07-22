import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // 사용자 존재 여부 확인
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "존재하지 않는 사용자" }, { status: 401 });
  }

  //비밀번호 확인
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "비밀번호 틀림 " }, { status: 401 });
  }

  //로그인 성공
  return NextResponse.json({
    message: "로그인 성공",
    user: { id: user.id, nickname: user.nickname },
  });
}
