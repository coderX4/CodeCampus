import {useEffect, useState} from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { Progress } from "@/components/ui/progress.jsx"
import { CheckCircle, Clock, Trophy, Users } from "lucide-react"
import StatsCard from "@/components/dashboard/stats-card.jsx"
import RecentSubmissions from "@/components/dashboard/recent-submissions.jsx"

export default function MainSection() {
  const [mainSectionData, setMainSectionData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchMainSectionData = async () => {
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
      const response = await fetch(`http://localhost:8083/api/users/getUserData/${loggedUser.email}`, {
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
        throw new Error(errorData.message || "Failed to fetch problems")
      }

      const data = await response.json()
      setMainSectionData(data)
    } catch (err) {
      console.error("Error fetching problems:", err)
      setError(err.message || "Failed to fetch problems")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMainSectionData()
  }, []);
  // Mock data
  const recentSubmissions = [
    {
      id: "1",
      problem: "Two Sum",
      problemId: "1",
      status: "Accepted",
      language: "Python",
      time: "2 hours ago",
      runtime: "56ms",
      memory: "14.2MB",
    },
    {
      id: "2",
      problem: "Valid Parentheses",
      problemId: "2",
      status: "Accepted",
      language: "Java",
      time: "Yesterday",
      runtime: "1ms",
      memory: "37.4MB",
    },
    {
      id: "3",
      problem: "Merge Two Sorted Lists",
      problemId: "3",
      status: "Wrong Answer",
      language: "C++",
      time: "2 days ago",
      runtime: "8ms",
      memory: "14.9MB",
    },
    {
      id: "4",
      problem: "Maximum Subarray",
      problemId: "4",
      status: "Time Limit Exceeded",
      language: "JavaScript",
      time: "3 days ago",
      runtime: "N/A",
      memory: "N/A",
    },
  ]

  const upcomingContests = [
    {
      id: "1",
      title: "Algorithms Championship",
      date: "March 15, 2025",
      time: "2:00 PM - 5:00 PM",
    },
    {
      id: "2",
      title: "Data Structures Showdown",
      date: "March 22, 2025",
      time: "10:00 AM - 1:00 PM",
    },
  ]

  const topicProgress = [
    { topic: "Arrays", completed: 80, total: 25 },
    { topic: "Linked Lists", completed: 60, total: 15 },
    { topic: "Trees", completed: 40, total: 20 },
    { topic: "Dynamic Programming", completed: 30, total: 30 },
    { topic: "Graphs", completed: 20, total: 18 },
  ]

  return (
      <div className="flex-1 overflow-auto">
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="contests">Contests</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Problems Solved"
                    value={45}
                    description="+5 from last week"
                    icon={<CheckCircle className="h-4 w-4 text-muted-foreground"/>}
                />
                <StatsCard
                    title="Contests Participated"
                    value={12}
                    description="+2 from last month"
                    icon={<Trophy className="h-4 w-4 text-muted-foreground"/>}
                />
                <StatsCard
                    title="Global Rank"
                    value="#78"
                    description="Improved by 5 positions"
                    icon={<Users className="h-4 w-4 text-muted-foreground"/>}
                />
                <StatsCard
                    title="Streak"
                    value="7 days"
                    description="Keep it up!"
                    icon={<Clock className="h-4 w-4 text-muted-foreground"/>}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Progress by Topic</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topicProgress.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{item.topic}</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((item.completed / 100) * item.total)}/{item.total}
                            </div>
                          </div>
                          <Progress value={item.completed}/>
                        </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Contests</CardTitle>
                    <CardDescription>Don't miss these events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingContests.map((contest, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Trophy className="h-5 w-5 text-primary"/>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{contest.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {contest.date} • {contest.time}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <Button size="sm" asChild>
                                <Link to={`/contest/${contest.id}`}>Register</Link>
                              </Button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="submissions" className="space-y-4">
              <RecentSubmissions submissions={recentSubmissions}/>
            </TabsContent>
            <TabsContent value="contests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contest History</CardTitle>
                  <CardDescription>Your performance in past contests</CardDescription>
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
                      {
                        name: "Weekly Challenge #41",
                        date: "January 22, 2025",
                        rank: "#5",
                        solved: "6/6",
                        score: "500",
                      },
                    ].map((contest, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Trophy className="h-5 w-5 text-primary"/>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{contest.name}</p>
                            <p className="text-xs text-muted-foreground">{contest.date}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-sm font-medium">Rank: {contest.rank}</p>
                            <p className="text-xs text-muted-foreground">
                              {contest.solved} problems • {contest.score} points
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}

