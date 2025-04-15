// src/app/api/post/[id]/route.ts
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

//게시글 수정

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { content } = await req.json()
    const id = Number(params.id)

    const updated = await prisma.post.update({
        where: { id },
        data: { content },
    })

    return NextResponse.json(updated)
}

//게시글 삭제

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    await prisma.image.deleteMany({ where: { postId: id } }) // 이미지도 함께 삭제
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ message: '삭제 성공' })
}