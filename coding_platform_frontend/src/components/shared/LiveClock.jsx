import { useState, useEffect } from "react"

export default function LiveClock({ showDate = false, className = "" }) {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        // Update time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        // Clean up interval on component unmount
        return () => clearInterval(interval)
    }, [])

    // Format time as HH:MM:SS AM/PM
    const formattedTime = currentTime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    })

    // Format date as Month Day, Year
    const formattedDate = currentTime.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className={`text-sm font-medium ${className}`}>
            <div className="text-muted-foreground">{showDate && formattedDate}</div>
            <div className="text-lg">{formattedTime}</div>
        </div>
    )
}
