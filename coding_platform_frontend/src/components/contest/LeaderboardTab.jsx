import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Trophy, Medal, Award, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import {baseUrl} from "@/utils/index.js";

export default function LeaderboardTab({ contestStatus, countdown, id, startTime, highlightUser: propsHighlightUser }) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
    const [leaderBoard, setLeaderBoard] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [contestEndTime, setContestEndTime] = useState(null)

    const [currentUserEmail, setCurrentUserEmail] = useState("")
    const [highlightUser, setHighlightUser] = useState(propsHighlightUser || false)

    useEffect(() => {
        if (contestStatus === "past") {
            fetchLeaderBoard()
        }
        else if (contestStatus === "upcoming" || contestStatus === "ongoing") {
            // For upcoming contests, clear leaderboard
            setIsLoading(false)
            setLeaderBoard([])
        }
    }, [id, contestStatus, contestEndTime])


    const fetchLeaderBoard = async () => {
        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(baseUrl+`/api/contest/getLeaderBoardsResult/${id}`, {
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
            // No need to sort or format time as data is already sorted and formatted from backend
            setLeaderBoard(data)
        } catch (err) {
            console.error("Error fetching contest results:", err)
            setError(err.message || "Failed to fetch contest result")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (leaderBoard.length > 0) {
            const storedUser = sessionStorage.getItem("user")
            const loggedUser = storedUser ? JSON.parse(storedUser) : null

            if (loggedUser && loggedUser.email) {
                setCurrentUserEmail(loggedUser.email)
                setHighlightUser(true) // Always set to true when we have user data

                // Find user's position in the leaderboard
                const userIndex = leaderBoard.findIndex((entry) => entry.email === loggedUser.email)

                if (userIndex !== -1) {
                    // Calculate which page the user is on
                    const userPage = Math.floor(userIndex / usersPerPage) + 1
                    setCurrentPage(userPage)
                }
            }
        }
    }, [leaderBoard, usersPerPage])

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

    // Get paginated leaderboard data
    const getPaginatedLeaderboard = () => {
        const indexOfLastUser = currentPage * usersPerPage
        const indexOfFirstUser = indexOfLastUser - usersPerPage
        return leaderBoard.slice(indexOfFirstUser, indexOfLastUser)
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
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
                ) : contestStatus === "ongoing" ?(
                    <div className="flex flex-col items-center justify-center py-16">
                        <Trophy className="h-20 w-20 text-muted-foreground mb-6 opacity-30" />
                        <p className="text-center text-muted-foreground text-lg">
                            Leaderboard will be available after the contest ends.
                            {countdown && <span className="block mt-2 font-medium text-primary">Contest ends in {countdown}</span>}
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
                            {getPaginatedLeaderboard().map((entry, index) => (
                                <TableRow
                                    key={entry.email}
                                    className={`${index + (currentPage - 1) * usersPerPage < 3 ? "bg-muted/10 font-medium" : ""} ${
                                        highlightUser && entry.email === currentUserEmail
                                            ? "bg-primary/15 outline outline-2 outline-primary shadow-md relative transform translate-y-[-2px] border-b-4 border-primary"
                                            : ""
                                    }`}
                                >
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center">
                                            {getRankIndicator(index + (currentPage - 1) * usersPerPage)}
                                        </div>
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
                                    <TableCell className="text-center font-mono">{entry.finishTime ? entry.finishTime : "---"}</TableCell>
                                    <TableCell className="text-center font-mono">{entry.timeTaken ? entry.timeTaken : "---"}</TableCell>
                                    <TableCell className="text-center font-semibold">{entry.finalScore}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {leaderBoard.length > 0 && (
                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {Math.min((currentPage - 1) * usersPerPage + 1, leaderBoard.length)} to{" "}
                            {Math.min(currentPage * usersPerPage, leaderBoard.length)} of {leaderBoard.length} participants
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                aria-label="First page"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, Math.ceil(leaderBoard.length / usersPerPage)) }, (_, i) => {
                                    // Show pages around current page
                                    let pageNum
                                    const totalPages = Math.ceil(leaderBoard.length / usersPerPage)

                                    if (totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            aria-label={`Page ${pageNum}`}
                                            aria-current={currentPage === pageNum ? "page" : undefined}
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === Math.ceil(leaderBoard.length / usersPerPage)}
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(Math.ceil(leaderBoard.length / usersPerPage))}
                                disabled={currentPage === Math.ceil(leaderBoard.length / usersPerPage)}
                                aria-label="Last page"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
