import {useState} from "react";

interface LikeButtonProps {
    postId: string;
    initialLiked: boolean;
    initialCount: number;
}

export default function LikeButton({postId, initialLiked, initialCount}: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked)
    const [count, setCount] = useState(initialCount)

    const toggleLike = async () => {
        const res = await fetch('/api/like' , {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({postId})
        })

        const data = await res.json()
        setLiked(data.liked)
        setCount(prev => prev +(data.liked ? 1 : -1))
    }
    return (
        <button onClick={toggleLike} className="text-sm text-pink-500">
            {liked ? '💖' : '🤍'} {count}
        </button>
    )
}