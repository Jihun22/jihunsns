'use client'

export default function BackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="mt-4 text-blue-600 underline hover:text-blue-800"
        >
            ← 뒤로가기
        </button>
    )
}
