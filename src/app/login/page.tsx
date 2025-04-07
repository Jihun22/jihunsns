'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export  default function  LoginPage() {
    const [form, setForm] = useState({email:'', password:''})
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setForm({...form, [e.target.name]: e.target.value})

    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(form),
        })

        const data = await  res.json()
        if (res.ok) {
            setMessage('로그인 성공!')
            router.push('/')
        }else {
            setMessage(data.error)
        }
    }

    return (

        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4"> 로그인</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="email"
                    name ="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="border p-2 w-full"
                    />
                <input
                    type="password"
                    name ="password"
                    placeholder="비밀번호"
                    onChange={handleChange}
                    className="border p-2 w-full"
                    />
                <button type ="submit" className="bg-blue-500 text-white px-4 py-2"> 로그인 </button>
            </form>
            {message && <p className ="mt-2 text-sm text-red-500">{message}</p>}

        </div>
    )
}