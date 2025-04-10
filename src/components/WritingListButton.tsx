'use client'

import { useState } from 'react'
import WritingList from './WritingList' // 같은 폴더 또는 경로에 따라 조정

export default function WritingListWrapper() {
    const [showList, setShowList] = useState(false)

    return (
        <div className="text-center">
            <button
                onClick={() => setShowList(!showList)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                {showList ? '글 목록 숨기기' : '글 목록 보기'}
            </button>

            {showList && <WritingList />}
        </div>
    )
}
