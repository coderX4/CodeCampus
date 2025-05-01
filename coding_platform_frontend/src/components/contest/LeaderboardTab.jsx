import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Trophy, Medal, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Badge } from "@/components/ui/badge.jsx"

export default function LeaderboardTab({ contestStatus, countdown, id, startTime }) {
    const [leaderBoard, setLeaderBoard] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    function calculateTimeTaken(startTime, finishTime) {
        if (!startTime || !finishTime) return "00:00:00" // return default if no input

        const today = new Date() // using today's date for parsing

        // Parse startTime (example: "10:40")
        const [startHours, startMinutes] = startTime.split(":").map(Number)
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, startMinutes, 0)

        // Parse finishTime manually (example: "11:05:59 AM")
        const [timePart, meridian] = finishTime.split(" ")
        const [finishHoursRaw, finishMinutes, finishSeconds] = timePart.split(":").map(Number)

        let finishHours = finishHoursRaw
        if (meridian === "PM" && finishHours !== 12) {
            finishHours += 12
        } else if (meridian === "AM" && finishHours === 12) {
            finishHours = 0
        }

        const finishDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            finishHours,
            finishMinutes,
            finishSeconds,
        )

        let diff = (finishDate.getTime() - startDate.getTime()) / 1000 // in seconds

        if (diff < 0) diff += 24 * 3600 // if finished after midnight

        // Convert seconds to hh:mm:ss
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = Math.floor(diff % 60)

        // Format hours, minutes, and seconds to always be two digits
        const formattedHours = String(hours).padStart(2, "0")
        const formattedMinutes = String(minutes).padStart(2, "0")
        const formattedSeconds = String(seconds).padStart(2, "0")

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }

    useEffect(() => {
        let intervalId

        const fetchLeaderBoard = async () => {
            const storedUser = sessionStorage.getItem("user")
            const loggedUser = storedUser ? JSON.parse(storedUser) : null

            if (!loggedUser || !loggedUser.token) {
                setError("Authentication required. Please log in again.")
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch(`http://localhost:8083/api/contest/getLeaderBoardsResult/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${loggedUser.token}`,
                    },
                })

                if (response.status === 403) {
                    setError("Access denied: You do not have permission to access this resource.")
                    setIsLoading(false)
                    return
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.message || "Failed to fetch contest result")
                }

                const data = await response.json()
                const updatedData = data.map((entry) => ({
                    ...entry,
                    timeTaken: calculateTimeTaken(startTime, entry.finishTime),
                }))

                // Updated sorting logic: prioritize finalScore first, then timeTaken
                updatedData.sort((a, b) => {
                    // First priority: finalScore (higher is better)
                    if (b.finalScore !== a.finalScore) {
                        return b.finalScore - a.finalScore
                    }

                    // Second priority: timeTaken (lower is better)
                    // Convert time strings to comparable values (seconds)
                    const timeA = convertTimeToSeconds(a.timeTaken)
                    const timeB = convertTimeToSeconds(b.timeTaken)
                    return timeA - timeB
                })

                setLeaderBoard(updatedData)
            } catch (err) {
                console.error("Error fetching contest results:", err)
                setError(err.message || "Failed to fetch contest result")
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeaderBoard() // fetch once immediately

        intervalId = setInterval(() => {
            fetchLeaderBoard()
        }, 60000) // every minute

        return () => clearInterval(intervalId) // cleanup interval on unmount or id change
    }, [id, startTime])

    // Add this helper function to convert time string to seconds for comparison
    function convertTimeToSeconds(timeString) {
        if (!timeString) return 0

        const [hours, minutes, seconds] = timeString.split(":").map(Number)
        return hours * 3600 + minutes * 60 + seconds
    }

    // Function to render rank badge/icon for top 3 positions
    const getRankIndicator = (position) => {
        switch (position) {
            case 0: // 1st place
                return <Trophy className="h-5 w-5 text-yellow-500" />
            case 1: // 2nd place
                return <Medal className="h-5 w-5 text-gray-400" />
            case 2: // 3rd place
                return <Award className="h-5 w-5 text-amber-700" />
            default:
                return <span className="font-semibold">{position + 1}</span>
        }
    }

    return (
        <Card className="shadow-md">
            <CardHeader className="bg-muted/40">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" /> Contest Leaderboard
                </CardTitle>
                <CardDescription>
                    {contestStatus === "upcoming" ? "Leaderboard will be available when the contest starts" : "Current standings"}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {contestStatus === "upcoming" ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Trophy className="h-20 w-20 text-muted-foreground mb-6 opacity-30" />
                        <p className="text-center text-muted-foreground text-lg">
                            Leaderboard will be available once the contest begins.
                            {countdown && <span className="block mt-2 font-medium text-primary">Contest starts in {countdown}</span>}
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <span className="ml-3">Loading leaderboard...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-destructive">
                        <p>{error}</p>
                    </div>
                ) : leaderBoard.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No entries yet</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="w-16 text-center">Rank</TableHead>
                                <TableHead>Participant</TableHead>
                                <TableHead className="text-center">Solved</TableHead>
                                <TableHead className="text-center">Score / Max Score</TableHead>
                                <TableHead className="text-center">Finish Time</TableHead>
                                <TableHead className="text-center">Time Taken</TableHead>
                                <TableHead className="text-center">Final Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderBoard.map((entry, index) => (
                                <TableRow key={entry.email} className={index < 3 ? "bg-muted/10 font-medium" : ""}>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center">{getRankIndicator(index)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className={index === 0 ? "ring-2 ring-yellow-500 ring-offset-2" : ""}>
                                                <AvatarImage src={entry.avatarUrl || ""} alt={entry.uname} />
                                                <AvatarFallback className={index === 0 ? "bg-yellow-100 text-yellow-800" : ""}>
                                                    {entry.uname?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{entry.uname}</div>
                                                <div className="text-sm text-muted-foreground">{entry.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={index < 3 ? "default" : "outline"} className="font-medium">
                                            {entry.solved}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">
                                        {entry.score} / {entry.maxScore}
                                    </TableCell>
                                    <TableCell className="text-center">{entry.finishTime}</TableCell>
                                    <TableCell className="text-center font-mono">{entry.timeTaken}</TableCell>
                                    <TableCell className="text-center font-mono">{entry.finalScore}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
