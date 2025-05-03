import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx"
import { Button } from "@/components/ui/button.jsx"
import {
    Trophy,
    Medal,
    Award,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit,
    MoreHorizontal,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"

export default function LeaderboardTable({
                                             data,
                                             departmentFilter = null,
                                             highlightUser = false,
                                             currentUserEmail = "",
                                             onHighlightUser = null,
                                             isAdmin = false,
                                         }) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10

    // Filter data by department if departmentFilter is provided
    const filteredData = departmentFilter ? data.filter((entry) => entry.department === departmentFilter) : data

    // Get paginated data
    const getPaginatedData = () => {
        const indexOfLastUser = currentPage * usersPerPage
        const indexOfFirstUser = indexOfLastUser - usersPerPage
        return filteredData.slice(indexOfFirstUser, indexOfLastUser)
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
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

    // Check if data has contest-specific fields
    const isContestData = data.length > 0 && "solved" in data[0]

    useEffect(() => {
        if (highlightUser && currentUserEmail) {
            // Find user's position in the filtered data
            const userIndex = filteredData.findIndex((entry) => entry.email === currentUserEmail)

            if (userIndex !== -1) {
                // Calculate which page the user is on
                const userPage = Math.floor(userIndex / usersPerPage) + 1
                setCurrentPage(userPage)
            }
        }
    }, [highlightUser, currentUserEmail, filteredData, usersPerPage])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-16 text-center">Rank</TableHead>
                        <TableHead>Participant</TableHead>
                        {!isContestData && <TableHead className="text-center">Department</TableHead>}
                        {isContestData ? (
                            <>
                                <TableHead className="text-center">Solved</TableHead>
                                <TableHead className="text-center">Score / Max Score</TableHead>
                                <TableHead className="text-center">Finish Time</TableHead>
                                <TableHead className="text-center">Time Taken</TableHead>
                            </>
                        ) : (
                            <>
                                <TableHead className="text-center">Problems</TableHead>
                                <TableHead className="text-center">Contests</TableHead>
                                <TableHead className="text-center">Problem points</TableHead>
                                <TableHead className="text-center">Contests points</TableHead>
                            </>
                        )}
                        <TableHead className="text-center">{isContestData ? "Final Score" : "Ranking Score"}</TableHead>
                        {isAdmin && <TableHead className="w-16 text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getPaginatedData().length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={isContestData ? (isAdmin ? 8 : 7) : isAdmin ? 9 : 8}
                                className="text-center py-6 text-muted-foreground"
                            >
                                No data available
                            </TableCell>
                        </TableRow>
                    ) : (
                        getPaginatedData().map((entry, index) => {
                            const actualIndex = index + (currentPage - 1) * usersPerPage
                            return (
                                <TableRow
                                    key={entry.email}
                                    className={`${actualIndex < 3 ? "bg-muted/10 font-medium" : ""} 
                                    ${highlightUser && entry.email === currentUserEmail ? "bg-primary/15 outline outline-2 outline-primary shadow-md relative transform translate-y-[-2px] border-b-4 border-primary" : ""}`}
                                >
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center">{getRankIndicator(actualIndex)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className={actualIndex === 0 ? "ring-2 ring-yellow-500 ring-offset-2" : ""}>
                                                <AvatarImage src={entry.avatarUrl || ""} alt={entry.uname} />
                                                <AvatarFallback className={actualIndex === 0 ? "bg-yellow-100 text-yellow-800" : ""}>
                                                    {entry.uname?.charAt(0) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{entry.uname}</div>
                                                <div className="text-sm text-muted-foreground">{entry.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {isContestData ? (
                                        <>
                                            <TableCell className="text-center">
                                                <Badge variant={actualIndex < 3 ? "default" : "outline"} className="font-medium">
                                                    {entry.solved}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">
                                                {entry.score} / {entry.maxScore}
                                            </TableCell>
                                            <TableCell className="text-center font-mono">
                                                {entry.finishTime ? entry.finishTime : "---"}
                                            </TableCell>
                                            <TableCell className="text-center font-mono">
                                                {entry.timeTaken ? entry.timeTaken : "---"}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">{entry.finalScore}</TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="text-center font-mono">
                                                {entry.department ? entry.department : "---"}
                                            </TableCell>
                                            <TableCell className="text-center font-mono">{entry.problems}</TableCell>
                                            <TableCell className="text-center font-mono">{entry.contests}</TableCell>
                                            <TableCell className="text-center font-mono">
                                                {entry.problemFinalScore ? entry.problemFinalScore : "---"}
                                            </TableCell>
                                            <TableCell className="text-center font-mono">
                                                {entry.contestFinalScore ? entry.contestFinalScore : "---"}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">
                                                {entry.finalLeaderBoardScore ? entry.finalLeaderBoardScore : "- - -"}
                                            </TableCell>
                                        </>
                                    )}

                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Score
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>View User Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>View Submissions</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Reset Score</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            {filteredData.length > 0 && (
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {Math.min((currentPage - 1) * usersPerPage + 1, filteredData.length)} to{" "}
                        {Math.min(currentPage * usersPerPage, filteredData.length)} of {filteredData.length} participants
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
                            {Array.from({ length: Math.min(5, Math.ceil(filteredData.length / usersPerPage)) }, (_, i) => {
                                // Show pages around current page
                                let pageNum
                                const totalPages = Math.ceil(filteredData.length / usersPerPage)

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
                            disabled={currentPage === Math.ceil(filteredData.length / usersPerPage)}
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(Math.ceil(filteredData.length / usersPerPage))}
                            disabled={currentPage === Math.ceil(filteredData.length / usersPerPage)}
                            aria-label="Last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
