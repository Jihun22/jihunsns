'use client'
import React, { useState } from 'react'
import {router} from "next/client"
import { useRouter } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const [form , setForm] = useState({ email: '' , nickname: '' , password: '' })
    const [message, setMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const  handleSubmit = async  (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {'Content-Type': 'application/json'},
        })

        const data = await res.json()
        if(res.ok) {
            setMessage('회원가입 성공!')
            router.push('/login')
        }else  {
            setMessage(data.error)
        }
    }
    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">회원가입</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input name="email" placeholder="이메일" onChange={handleChange} className="border p-2 w-full" />
                <input name="nickname" placeholder="닉네임" onChange={handleChange} className="border p-2 w-full" />
                <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} className="border p-2 w-full" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">가입하기</button>
            </form>
            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </div>
    )
}