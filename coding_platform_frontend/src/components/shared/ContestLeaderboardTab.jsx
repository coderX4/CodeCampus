import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Trophy, Search, AlertCircle, Download, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Button } from "@/components/ui/button.jsx"
import LeaderboardTable from "./LeaderboardTable.jsx"
import { determineContestStatus } from "@/utils/contestUtils.js"
import ContestInfoCard from "@/components/contest/ContestInfoCard.jsx"

export default function ContestLeaderboardTab({ highlightUser = false, isAdmin = false }) {
    const [currentUserEmail, setCurrentUserEmail] = useState("")
    const [contests, setContests] = useState([])
    const [selectedContest, setSelectedContest] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [leaderboardData, setLeaderboardData] = useState([])
    const [isLoadingContests, setIsLoadingContests] = useState(true)
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)
    const [isRecalculating, setIsRecalculating] = useState(false)
    const [error, setError] = useState("")

    // Fetch all contests
    const fetchContests = async () => {
        setIsLoadingContests(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsLoadingContests(false)
            return
        }

        try {
            const response = await fetch("http://localhost:8083/api/contest/getcontests", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (response.status === 403) {
                setError("Access denied: You do not have permission to access this resource.")
                setIsLoadingContests(false)
                return
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to fetch contests")
            }

            const data = await response.json()

            // Filter out draft contests and update contest statuses
            const updatedContests = data
                .filter((contest) => contest.saveAsDraft !== true) // Filter out drafts
                .map((contest) => ({
                    ...contest,
                    status: determineContestStatus(contest),
                }))

            setContests(updatedContests)
        } catch (err) {
            console.error("Error fetching contests:", err)
            setError(err.message || "Failed to fetch contests")
        } finally {
            setIsLoadingContests(false)
        }
    }

    // Fetch leaderboard data for a specific contest
    const fetchContestLeaderboard = async (contestId) => {
        if (!contestId) return

        setIsLoadingLeaderboard(true)
        setError("")
        setLeaderboardData([])

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsLoadingLeaderboard(false)
            return
        }

        try {
            const response = await fetch(`http://localhost:8083/api/contest/getLeaderBoardsResult/${contestId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggedUser.token}`,
                },
            })

            if (response.status === 403) {
                setError("Access denied: You do not have permission to access this resource.")
                setIsLoadingLeaderboard(false)
                return
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to fetch contest leaderboard")
            }

            const data = await response.json()
            setLeaderboardData(data)
        } catch (err) {
            console.error("Error fetching contest leaderboard:", err)
            setError(err.message || "Failed to fetch contest leaderboard")
        } finally {
            setIsLoadingLeaderboard(false)
        }
    }

    // Recalculate contest rankings
    const recalculateContestRankings = async () => {
        if (!selectedContest) return

        setIsRecalculating(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsRecalculating(false)
            return
        }

        try {
            // This would be the actual API call to recalculate contest rankings
            // For now, we'll just simulate it with a timeout
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // After recalculation, fetch the updated leaderboard
            await fetchContestLeaderboard(selectedContest)
        } catch (err) {
            console.error("Error recalculating contest rankings:", err)
            setError(err.message || "Failed to recalculate contest rankings")
        } finally {
            setIsRecalculating(false)
        }
    }

    // Export contest leaderboard
    const exportContestLeaderboard = () => {
        if (!leaderboardData.length || !selectedContest) return

        const selectedContestDetails = contests.find((contest) => contest.id === selectedContest)
        const contestName = selectedContestDetails?.title || "contest"

        // Convert to CSV
        const headers = [
            "Rank",
            "Name",
            "Email",
            "Problems Solved",
            "Score",
            "Max Score",
            "Finish Time",
            "Time Taken",
            "Final Score",
        ]
        const csvContent = [
            headers.join(","),
            ...leaderboardData.map((entry, index) =>
                [
                    index + 1,
                    entry.uname,
                    entry.email,
                    entry.solved || 0,
                    entry.score || 0,
                    entry.maxScore || 0,
                    entry.finishTime || "N/A",
                    entry.timeTaken || "N/A",
                    entry.finalScore || 0,
                ].join(","),
            ),
        ].join("\n")

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${contestName}_leaderboard_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Fetch contests on component mount
    useEffect(() => {
        fetchContests()
    }, [])

    // Fetch leaderboard when selected contest changes
    useEffect(() => {
        if (selectedContest) {
            fetchContestLeaderboard(selectedContest)
        }
    }, [selectedContest])

    // Add this useEffect to handle highlighting
    useEffect(() => {
        if (contests.length > 0 && highlightUser) {
            const storedUser = sessionStorage.getItem("user")
            const loggedUser = storedUser ? JSON.parse(storedUser) : null

            if (loggedUser && loggedUser.email) {
                setCurrentUserEmail(loggedUser.email)
            }
        }
    }, [contests, highlightUser])

    //Filter contests based on search query and difficulty
    const filteredContests = contests
        .filter((contest) => {
            const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesDifficulty = difficultyFilter === "all" || contest.difficulty === difficultyFilter
            return matchesSearch && matchesDifficulty
        })
        .slice()
        .reverse()

    // Get the selected contest details
    const selectedContestDetails = contests.find((contest) => contest.id === selectedContest)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Contest Rankings</CardTitle>
                    <CardDescription>Top performers in the selected contest</CardDescription>
                </div>
                {isAdmin && selectedContest && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={recalculateContestRankings}
                            disabled={isRecalculating || !selectedContest}
                        >
                            {isRecalculating ? (
                                <>
                                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                                    Recalculating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-1 h-4 w-4" /> Recalculate
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportContestLeaderboard}
                            disabled={!selectedContest || leaderboardData.length === 0}
                        >
                            <Download className="mr-1 h-4 w-4" /> Export
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Difficulties</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedContest}
                            onValueChange={setSelectedContest}
                            disabled={isLoadingContests || filteredContests.length === 0}
                        >
                            <SelectTrigger className="h-9 w-[250px]">
                                <SelectValue placeholder="Select a contest" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredContests.map((contest) => (
                                    <SelectItem key={contest.id} value={contest.id}>
                                        {contest.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoadingContests ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <span className="ml-3">Loading contests...</span>
                    </div>
                ) : error && !selectedContest ? (
                    <div className="text-center py-16 text-destructive flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>{error}</p>
                    </div>
                ) : filteredContests.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        No contests found matching your search criteria.
                    </div>
                ) : !selectedContest ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Trophy className="h-20 w-20 text-muted-foreground mb-6 opacity-30" />
                        <p className="text-center text-muted-foreground text-lg">Select a contest to view its leaderboard</p>
                    </div>
                ) : isLoadingLeaderboard ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <span className="ml-3">Loading leaderboard...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-destructive flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>{error}</p>
                    </div>
                ) : leaderboardData.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">No leaderboard data available for this contest.</div>
                ) : (
                    <>
                        <div className="flex flex-row-2 gap-5 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold">{selectedContestDetails?.title}</h3>
                                {selectedContestDetails?.difficulty && (
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                            selectedContestDetails.difficulty === "easy"
                                                ? "bg-green-100 text-green-800"
                                                : selectedContestDetails.difficulty === "medium"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                        }`}
                                    >
                    {selectedContestDetails.difficulty.charAt(0).toUpperCase() +
                        selectedContestDetails.difficulty.slice(1)}
                  </span>
                                )}
                            </div>
                            <ContestInfoCard contest={selectedContestDetails} />
                        </div>
                        <LeaderboardTable
                            data={leaderboardData}
                            highlightUser={highlightUser}
                            currentUserEmail={currentUserEmail}
                            isAdmin={isAdmin}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    )
}
