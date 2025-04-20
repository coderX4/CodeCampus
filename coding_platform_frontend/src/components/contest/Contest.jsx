import { useState, useEffect } from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "../ui/button.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.jsx"
import ContestHeader from "./ContestHeader.jsx"
import ContestInfoCard from "./ContestInfoCard.jsx"
import ProblemsTab from "./ProblemsTab.jsx"
import LeaderboardTab from "./LeaderboardTab.jsx"
import RulesTab from "./RulesTab.jsx"

export default function Contest() {
  const { id } = useParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("problems")
  const [contestData, setContestData] = useState(null)
  const [problems, setProblems] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [countdown, setCountdown] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Try to get contest data from location state or fetch it
  useEffect(() => {
    if (location.state?.contest) {
      setContestData(location.state.contest)
      setIsLoading(false)
    } else {
      fetchContestDetails()
    }
  }, [id, location.state])

  // Fetch all contest details including problems in a single request
  const fetchContestDetails = async () => {
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
      const response = await fetch(`http://localhost:8083/api/contest/getcontestdetails/${id}`, {
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
        throw new Error(errorData.message || "Failed to fetch contest details")
      }

      const data = await response.json()
      const updatedProblems = data.problems.map((problem) => ({
        ...problem,
      }))
      setContestData(data)
      setProblems(updatedProblems)
    } catch (err) {
      console.error("Error fetching contest details:", err)
      setError(err.message || "Failed to fetch contest details")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate time remaining until contest starts or ends
  useEffect(() => {
    if (!contestData) return

    const calculateTimeRemaining = () => {
      const now = new Date()

      // Parse start date and time
      const [year, month, day] = contestData.startDate.split("-").map(Number)
      const [hours, minutes] = contestData.startTime.split(":").map(Number)
      const startDateTime = new Date(year, month - 1, day, hours, minutes)

      // Parse duration to get end time
      const durationHours = Number.parseInt(contestData.duration.split(" ")[0], 10)
      const endDateTime = new Date(startDateTime)
      endDateTime.setHours(endDateTime.getHours() + durationHours)

      // Determine status and time remaining
      if (now < startDateTime) {
        // Upcoming contest
        const diff = startDateTime - now
        setTimeRemaining({ status: "upcoming", diff })
      } else if (now >= startDateTime && now <= endDateTime) {
        // Ongoing contest
        const diff = endDateTime - now
        setTimeRemaining({ status: "ongoing", diff })
      } else {
        // Past contest
        setTimeRemaining({ status: "past", diff: 0 })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [contestData])

  // Format countdown display
  useEffect(() => {
    if (!timeRemaining) return

    const formatCountdown = () => {
      const { diff } = timeRemaining
      if (diff <= 0) return ""

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      let countdownText = ""
      if (days > 0) countdownText += `${days}d `
      if (hours > 0 || days > 0) countdownText += `${hours}h `
      if (minutes > 0 || hours > 0 || days > 0) countdownText += `${minutes}m `
      countdownText += `${seconds}s`

      return countdownText
    }

    setCountdown(formatCountdown())
  }, [timeRemaining])

  // Get contest status based on timeRemaining
  const getContestStatus = () => {
    if (!timeRemaining) return contestData?.status || "upcoming"
    return timeRemaining.status
  }

  const contestStatus = getContestStatus()

  if (isLoading) {
    return (
        <main className="flex-1">
          <div className="container py-8">
            <div className="flex justify-center items-center h-64">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="ml-2">Loading contest details...</p>
            </div>
          </div>
        </main>
    )
  }

  if (error) {
    return (
        <main className="flex-1">
          <div className="container py-8">
            <div className="flex flex-col items-center justify-center h-64 text-destructive">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg">{error}</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/dashboard/contests">Back to Contests</Link>
              </Button>
            </div>
          </div>
        </main>
    )
  }

  if (!contestData) {
    return (
        <main className="flex-1">
          <div className="container py-8">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-muted-foreground">Contest not found</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/dashboard/contests">Back to Contests</Link>
              </Button>
            </div>
          </div>
        </main>
    )
  }

  return (
      <main className="flex-1">
        <div className="container py-4">
          <div className="mb-4">
            <Link
                to="/dashboard/contests"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Contests
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <ContestHeader
                contest={contestData}
                contestStatus={contestStatus}
                countdown={countdown}
                timeRemaining={timeRemaining}
            />

            <ContestInfoCard contest={contestData} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="problems">Problems</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="problems" className="space-y-6">
                <ProblemsTab contestStatus={contestStatus} countdown={countdown} problems={problems || []} />
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <LeaderboardTab contestStatus={contestStatus} countdown={countdown} />
              </TabsContent>

              <TabsContent value="rules" className="space-y-6">
                <RulesTab contest={contestData} problemCount={problems?.length || 0} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}
