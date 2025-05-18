import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Progress } from "@/components/ui/progress.jsx"
import { CheckCircle, Clock, Trophy, Users, ArrowUpRight, AlertCircle, Code, Calendar } from "lucide-react"
import StatsCard from "@/components/dashboard/stats-card.jsx"
import RecentSubmissions from "@/components/dashboard/recent-submissions.jsx"
import { baseUrl } from "@/utils/index.js"
import { useToast } from "@/hooks/use-toast"

export default function MainSection() {
  const { toast } = useToast()
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Stats derived from userData
  const [stats, setStats] = useState({
    problemsSolved: 0,
    totalProblems: 0,
    contestsParticipated: 0,
    rank: 0,
    streak: 0,
  })

  // Recent submissions from userData
  const [recentSubmissions, setRecentSubmissions] = useState([])

  // Upcoming contests from userData
  const [upcomingContests, setUpcomingContests] = useState([])

  // Topic progress from userData
  const [topicProgress, setTopicProgress] = useState([])

  // Recommended problems based on user level
  const [recommendedProblems, setRecommendedProblems] = useState([])

  const fetchUserData = async () => {
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
      const response = await fetch(baseUrl + `/api/users/getUserData/${loggedUser.email}`, {
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
        throw new Error(errorData.message || "Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)

      // Process the data to extract relevant information
      processUserData(data)
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError(err.message || "Failed to fetch user data")
      toast({
        title: "Error",
        description: err.message || "Failed to fetch user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Process the user data to extract relevant information
  const processUserData = (data) => {
    if (data) {
      // Set stats based on actual data structure
      setStats({
        problemsSolved: data.problemsSolved || 0,
        totalProblems: 100, // Assuming total problems count is fixed or can be calculated
        contestsParticipated: data.contestsParticipated || 0,
        rank: data.rank || 0,
        streak: data.streak || 0,
      })

      // Set topic progress from the API data
      setTopicProgress(data.topicProgress || [])

      // Set recent submissions in reverse order
      setRecentSubmissions(data.recentSubmissions ? [...data.recentSubmissions].reverse() : [])

      // Filter upcoming contests - only show contests that haven't started yet
      const now = new Date()
      const upcomingFilteredContests = data.upcomingContests
          ? data.upcomingContests
              .filter((contest) => {
                const contestDate = new Date(`${contest.startDate}T${contest.startTime}`)
                return contestDate > now
              })
              .sort((a, b) => {
                // Compare dates first
                const dateA = new Date(`${a.startDate}T${a.startTime}`)
                const dateB = new Date(`${b.startDate}T${b.startTime}`)
                return dateA - dateB // Sort by ascending date (earliest first)
              })
          : []

      // Only take the first few upcoming contests
      setUpcomingContests(upcomingFilteredContests.slice(0, 3))

      // Fetch recommended problems
      fetchRecommendedProblems()
    }
  }

  // Add a function to fetch recommended problems
  const fetchRecommendedProblems = async () => {
    const storedUser = sessionStorage.getItem("user")
    const loggedUser = storedUser ? JSON.parse(storedUser) : null

    if (!loggedUser || !loggedUser.token) {
      return
    }

    try {
      const response = await fetch(baseUrl + `/api/problems/getactiveproblemsdto/${loggedUser.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommended problems")
      }

      const data = await response.json()

      // Process the problems to get recommended ones - only easy ones in reverse order
      const recommended = data
          .filter((problem) => problem.status === "active" && problem.difficulty.toLowerCase() === "easy")
          .reverse() // Reverse the order
          .slice(0, 4) // Take first 4 problems
          .map((problem) => ({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            tags: problem.tags || [],
            solvedBy: problem.solvedPercentage || "N/A",
          }))

      setRecommendedProblems(recommended)
    } catch (err) {
      console.error("Error fetching recommended problems:", err)
    }
  }

  useEffect(() => {
    fetchUserData()

    // Set up a refresh interval (optional)
    const refreshInterval = setInterval(() => {
      fetchUserData()
    }, 300000) // Refresh every 5 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  const handleJoinContest = (contestId) => {
    // Navigate to contest page
    window.location.href = `/dashboard/contest/${contestId}`
  }

  // Loading state
  if (isLoading && !userData) {
    return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
    )
  }

  // Error state
  if (error && !userData) {
    return (
        <div className="flex items-center justify-center h-full p-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={fetchUserData} className="w-full">
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
    )
  }

  return (
      <div className="flex-1 overflow-auto">
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button onClick={fetchUserData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Problems Solved"
                value={stats.problemsSolved}
                description={`${Math.round((stats.problemsSolved / stats.totalProblems) * 100)}% completion rate`}
                icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
                title="Contests Participated"
                value={stats.contestsParticipated}
                description="Keep challenging yourself!"
                icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
                title="Global Rank"
                value={`#${stats.rank}`}
                description="Among all coders"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
                title="Streak"
                value={`${stats.streak} days`}
                description="Keep it up!"
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="contests">Contests</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Progress by Topic</CardTitle>
                    <CardDescription>Track your mastery across different areas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topicProgress.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{item.topic}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.completed}/{item.total}
                            </div>
                          </div>
                          <Progress value={item.total > 0 ? (item.completed / item.total) * 100 : 0} />
                        </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentSubmissions.slice(0, 3).map((submission, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    submission.status === true ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}
                            >
                              <Code className="h-5 w-5" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-medium leading-none">{submission.problem}</p>
                              <p className="text-xs text-muted-foreground">
                                {submission.language} • {new Date(submission.time).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              {submission.status === true ? (
                                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Solved</span>
                              ) : (
                                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">Failed</span>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("submissions")}>
                      View All Submissions
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Contests</CardTitle>
                  <CardDescription>Don't miss these events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingContests.map((contest, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Trophy className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">{contest.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {contest.startDate} • {contest.startTime} ({contest.duration} hours)
                            </p>
                          </div>
                          <Button size="sm" onClick={() => handleJoinContest(contest.id)}>
                            Register
                          </Button>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard/contests" className="text-sm text-primary flex items-center">
                    View all contests
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Problems</CardTitle>
                  <CardDescription>Based on your skill level and recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendedProblems.map((problem) => (
                        <div key={problem.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{problem.title}</h3>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    problem.difficulty === "easy"
                                        ? "bg-green-100 text-green-600"
                                        : problem.difficulty === "medium"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-red-100 text-red-600"
                                }`}
                            >
                          {problem.difficulty}
                        </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {problem.tags &&
                                problem.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {tag}
                            </span>
                                ))}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">Solved by {problem.solvedBy} of users</span>
                            <Button size="sm" asChild>
                              <Link to={`/editor/problem/${problem.id}`}>Solve</Link>
                            </Button>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/practice" className="w-full">
                    <Button className="w-full">View All Problems</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Contests Tab */}
            <TabsContent value="contests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Contests</CardTitle>
                  <CardDescription>Register and prepare for these coding challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingContests.map((contest, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-medium text-lg">{contest.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                {contest.startDate}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {contest.startTime} ({contest.duration} hours)
                              </div>
                            </div>
                            <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-4">
                            {contest.participants} participants
                          </span>
                              <Button onClick={() => handleJoinContest(contest.id)}>Register</Button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/*<Card>
                <CardHeader>
                  <CardTitle>Past Contest Performance</CardTitle>
                  <CardDescription>Your results from previous contests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Weekly Challenge #42",
                        date: "March 1, 2025",
                        rank: "#12",
                        solved: "4/6",
                        score: "350",
                      },
                      {
                        name: "Data Structures Marathon",
                        date: "February 15, 2025",
                        rank: "#8",
                        solved: "5/8",
                        score: "420",
                      },
                      {
                        name: "Algorithms Showdown",
                        date: "January 28, 2025",
                        rank: "#15",
                        solved: "3/5",
                        score: "280",
                      },
                    ].map((contest, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Trophy className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">{contest.name}</p>
                            <p className="text-xs text-muted-foreground">{contest.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Rank: {contest.rank}</p>
                            <p className="text-xs text-muted-foreground">
                              {contest.solved} problems • {contest.score} points
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>*/}
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-4">
              <RecentSubmissions submissions={recentSubmissions} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
