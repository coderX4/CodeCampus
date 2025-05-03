import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Search, RefreshCw, Download, Filter, Trophy } from "lucide-react"
import LeaderboardTable from "@/components/shared/LeaderboardTable.jsx"
import ContestLeaderboardTab from "@/components/shared/ContestLeaderboardTab.jsx"

export default function AdminLeaderboard() {
    const [activeTab, setActiveTab] = useState("global")
    const [searchQuery, setSearchQuery] = useState("")
    const [timeFilter, setTimeFilter] = useState("all-time")
    const [departmentFilter, setDepartmentFilter] = useState("all")
    const [leaderBoard, setLeaderBoard] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [departments, setDepartments] = useState([])
    const [isRecalculating, setIsRecalculating] = useState(false)

    // Fetch global leaderboard data
    const fetchGlobalLeaderBoard = async () => {
        setIsLoading(true)
        setError("")

        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null

        if (!loggedUser || !loggedUser.token) {
            setError("Authentication required. Please log in again.")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`http://localhost:8083/api/leaderboard/getglobal`, {
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
                throw new Error(errorData.message || "Failed to fetch leaderboard data")
            }

            const data = await response.json()
            setLeaderBoard(data)

            // Extract unique departments for the filter
            const uniqueDepartments = [...new Set(data.map((entry) => entry.department).filter(Boolean))]
            if (uniqueDepartments.length > 0) {
                setDepartments([
                    { value: "all", label: "All Departments" },
                    ...uniqueDepartments.map((dept) => ({
                        value: dept,
                        label: dept.charAt(0).toUpperCase() + dept.slice(1), // Capitalize first letter
                    })),
                ])
            }
        } catch (err) {
            console.error("Error fetching leaderboard data:", err)
            setError(err.message || "Failed to fetch leaderboard data")
        } finally {
            setIsLoading(false)
        }
    }

    // Recalculate rankings
    const recalculateRankings = async () => {
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
            // This would be the actual API call to recalculate rankings
            // For now, we'll just simulate it with a timeout
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // After recalculation, fetch the updated leaderboard
            await fetchGlobalLeaderBoard()
        } catch (err) {
            console.error("Error recalculating rankings:", err)
            setError(err.message || "Failed to recalculate rankings")
        } finally {
            setIsRecalculating(false)
        }
    }

    // Export leaderboard data
    const exportLeaderboard = () => {
        // Filter data based on current filters
        const dataToExport = leaderBoard.filter((user) => {
            const matchesSearch =
                user.uname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter

            return matchesSearch && matchesDepartment
        })

        // Convert to CSV
        const headers = [
            "Rank",
            "Name",
            "Email",
            "Department",
            "Problems",
            "Contests",
            "Problem Points",
            "Contest Points",
            "Total Score",
        ]
        const csvContent = [
            headers.join(","),
            ...dataToExport.map((user, index) =>
                [
                    index + 1,
                    user.uname,
                    user.email,
                    user.department || "N/A",
                    user.problems || 0,
                    user.contests || 0,
                    user.problemFinalScore || 0,
                    user.contestFinalScore || 0,
                    user.finalLeaderBoardScore || 0,
                ].join(","),
            ),
        ].join("\n")

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `leaderboard_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }


    // Filter users based on search query, department, and time period
    const filteredUsers = leaderBoard.filter((user) => {
        const matchesSearch =
            user.uname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter

        // Time filter would be implemented here if we had timestamp data
        // For now, we'll just return true for all time filters
        const matchesTime = true

        return matchesSearch && matchesDepartment && matchesTime
    })

    useEffect(() => {
        fetchGlobalLeaderBoard()
    }, [])

    const checkAdmin = () => {
        const storedUser = sessionStorage.getItem("user")
        const loggedUser = storedUser ? JSON.parse(storedUser) : null
        if(loggedUser.role === "ADMIN"){
            return true
        }
        else{
            return false
        }
    }

    return (
        <div className="flex-1 overflow-auto">
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Leaderboard Management</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={recalculateRankings} disabled={isRecalculating}>
                            {isRecalculating ? (
                                <>
                                    <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                                    Recalculating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-1 h-4 w-4" /> Recalculate Rankings
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportLeaderboard}>
                            <Download className="mr-1 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-time">All Time</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="h-9 w-[180px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.value} value={dept.value}>
                                        {dept.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="global">Global Rankings</TabsTrigger>
                        <TabsTrigger value="contest">Contest Rankings</TabsTrigger>
                        <TabsTrigger value="department">Department Rankings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="global" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Global Leaderboard</CardTitle>
                                <CardDescription>Rankings based on overall performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                        <span className="ml-3">Loading leaderboard...</span>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-16 text-destructive">
                                        <p>{error}</p>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center py-16 text-muted-foreground">
                                        No users found matching your search criteria.
                                    </div>
                                ) : (
                                    <LeaderboardTable
                                        data={filteredUsers}
                                        isAdmin={checkAdmin()}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contest" className="space-y-4">
                        <ContestLeaderboardTab isAdmin={checkAdmin()} />
                    </TabsContent>

                    <TabsContent value="department" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Department Rankings</CardTitle>
                                    <CardDescription>Rankings by department</CardDescription>
                                </div>
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                                        <span className="ml-3">Loading department data...</span>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-16 text-destructive">
                                        <p>{error}</p>
                                    </div>
                                ) : departmentFilter === "all" ? (
                                    <div className="text-center py-16 text-muted-foreground">
                                        Please select a specific department to view rankings.
                                    </div>
                                ) : (
                                    <LeaderboardTable
                                        data={leaderBoard}
                                        departmentFilter={departmentFilter}
                                        isAdmin={checkAdmin()}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
