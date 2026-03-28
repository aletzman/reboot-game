"use client"

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function LevelRedirect() {
    const router = useRouter()
    const { actId } = useParams()
    
    useEffect(() => {
        router.push(`/game/${actId}`)
    }, [actId])

    return null
}
