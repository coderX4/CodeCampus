import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx"
import { Trophy } from "lucide-react"
import LeaderboardTable from "../../components/shared/LeaderboardTable.jsx"
import ContestLeaderboardTab from "../../components/shared/ContestLeaderboardTab.jsx"
import {baseUrl} from "@/utils/index.js";

export default function Leaderboard() {
  const [leaderBoard, setLeaderBoard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("CSE")
  const [departments, setDepartments] = useState([
    { value: "CSE", label: "Computer Science and Engineering" },
    { value: "DS", label: "Data Science" },
    { value: "AI", label: "Artificial Intelligence" },
    { value: "ML", label: "Machine Learning" },
    { value: "AIML", label: "AIML" },
    { value: "CSBS", label: "CSBS" },
    { value: "ME", label: "Mechanical" },
    { value: "BIOTECH", label: "Bio. Tech" },
    { value: "ECE", label: "Electrical (ECE)" },
    { value: "IOT", label: "Internet of Thing" },
  ])

  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [highlightUser, setHighlightUser] = useState(false)

  const fetchGlobalLeaderBoard = async () => {
    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.token) {
      setError("Authentication required. Please log in again.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(baseUrl+`/api/leaderboard/getglobal`, {
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
        setDepartments(
            uniqueDepartments.map((dept) => ({
              value: dept,
              label: dept.charAt(0).toUpperCase() + dept.slice(1), // Capitalize first letter
            })),
        )
      }
    } catch (err) {
      console.error("Error fetching leaderboard data:", err)
      setError(err.message || "Failed to fetch leaderboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToUserRanking = () => {
    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.email) {
      return
    }

    setCurrentUserEmail(loggedUser.email)
    setHighlightUser(true)

    // Find user's position in the leaderboard
    const userIndex = leaderBoard.findIndex((entry) => entry.email === loggedUser.email)

    if (userIndex === -1) {
      return
    }

    // Calculate which page the user is on
    const userPage = Math.floor(userIndex / 10) + 1

    // Set the appropriate tab and department if needed
    if (departmentFilter !== leaderBoard[userIndex].department) {
      setDepartmentFilter(leaderBoard[userIndex].department)
    }
  }

  useEffect(() => {
    fetchGlobalLeaderBoard()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="flex justify-center items-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-3">Loading leaderboard...</span>
          </div>
      )
    }

    if (error) {
      return (
          <div className="text-center py-16 text-destructive">
            <p>{error}</p>
          </div>
      )
    }

    if (leaderBoard.length === 0) {
      return (
          <div className="text-center py-16 text-muted-foreground">
            <p>No entries yet</p>
          </div>
      )
    }

    return (
        <LeaderboardTable
            data={leaderBoard}
            highlightUser={highlightUser}
            currentUserEmail={currentUserEmail}
            onHighlightUser={scrollToUserRanking}
        />
    )
  }

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline">This Month</Button>
                <Button variant="outline" onClick={scrollToUserRanking}>
                  <Trophy className="mr-2 h-4 w-4" />
                  My Ranking
                </Button>
              </div>
            </div>
            <Tabs defaultValue="global" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="contests">Contests</TabsTrigger>
                <TabsTrigger value="department">Department</TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Rankings</CardTitle>
                    <CardDescription>Top performers across all challenges and contests</CardDescription>
                  </CardHeader>
                  <CardContent>{renderContent()}</CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contests" className="space-y-6">
                <ContestLeaderboardTab highlightUser={true} />
              </TabsContent>

              <TabsContent value="department" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Department Rankings</CardTitle>
                      <CardDescription>Top performers in your department</CardDescription>
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue defaultValue="CSE" placeholder="Select department" />
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
                    ) : (
                        <LeaderboardTable
                            data={leaderBoard}
                            departmentFilter={departmentFilter}
                            highlightUser={highlightUser}
                            currentUserEmail={currentUserEmail}
                            onHighlightUser={scrollToUserRanking}
                        />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}
