import { useState, useEffect } from 'react'

export function useLiveClock() {
    const [time, setTime] = useState('')
    useEffect(() => {
        function update() {
            const now = new Date()
            setTime(now.toLocaleTimeString('es-ES', { hour12: false }))
        }
        update()
        const id = setInterval(update, 1000)
        return () => clearInterval(id)
    }, [])
    return time
}
