import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx"
import { AlertCircle } from "lucide-react"
import LiveClock from "@/components/shared/LiveClock.jsx"
import { determineContestStatus } from "@/utils/contestUtils.js"
import ContestCard from "@/components/contest/ContestCard.jsx"

export default function Contests() {
  const [contests, setContests] = useState([])
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchContests = async () => {
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
      const response = await fetch("http://localhost:8083/api/contest/getcontests", {
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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  // Update contest statuses based on current time
  useEffect(() => {
    // Set up interval to update contest statuses every minute
    const interval = setInterval(fetchContests, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Filter contests based on active tab
  const filteredContests = contests.filter((contest) => activeTab === "all" || contest.status === activeTab)

  // Loading and error states
  const renderContent = () => {
    if (isLoading && contests.length === 0) {
      return (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading contests...</p>
          </div>
      )
    }

    if (error) {
      return (
          <div className="text-center py-8 text-destructive flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
      )
    }

    if (filteredContests.length === 0) {
      return (
          <div className="text-center py-8 text-muted-foreground">No {activeTab} contests available at the moment.</div>
      )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContests.map((contest) => (
              <ContestCard key={contest.id} {...contest} />
          ))}
        </div>
    )
  }

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Contests</h1>
              <LiveClock showDate={true} className="text-right" />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-6">
                {renderContent()}
              </TabsContent>
              <TabsContent value="ongoing" className="space-y-6">
                {renderContent()}
              </TabsContent>
              <TabsContent value="past" className="space-y-6">
                {renderContent()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}
