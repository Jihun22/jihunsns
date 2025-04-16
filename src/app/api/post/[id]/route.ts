// src/app/api/post/[id]/route.ts
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

//게시글 수정

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const formData = await req.formData()
    const content = formData.get("content")?.toString()
    const id = Number(params.id)

    if(!content || isNaN(id)){
        return NextResponse.json({error: '잘못된 요청입니다.'} , {status:400})
    }

    const updated = await prisma.post.update({
        where: { id },
        data: { content },
    })

    return NextResponse.json(updated)
}

export async function GET(_: Request, {params}: { params: { id: string } }) {
    const id = Number(params.id)
    const post = await prisma.post.findUnique({
        where: { id },
        include : {images: true},
    })
    if(!post){
        return NextResponse.json({error :'게시글 없음'} , {status:404})
    }
    return NextResponse.json(post)
}

//게시글 삭제

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    await prisma.image.deleteMany({ where: { postId: id } }) // 이미지도 함께 삭제
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ message: '삭제 성공' })
}