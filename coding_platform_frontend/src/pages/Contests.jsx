import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Trophy, Users } from "lucide-react"
import { Link } from "react-router-dom"

function ContestCard({ id, title, description, date, time, participants, difficulty, problems, status = "upcoming" }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="outline">{difficulty}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {date} • {time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{participants} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{problems} problems</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/dashboard/contest/${id}`}>View Details</Link>
        </Button>
        {status === "upcoming" && (
          <Button asChild>
            <Link to={`/dashboard/contest/${id}`}>Register</Link>
          </Button>
        )}
        {status === "ongoing" && (
          <Button asChild>
            <Link to={`/dashboard/contest/${id}`}>Enter Contest</Link>
          </Button>
        )}
        {status === "past" && (
          <Button variant="secondary" asChild>
            <Link to={`/dashboard/contest/${id}`}>View Results</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function Contests() {
  // Mock contests data
  const upcomingContests = [
    {
      id: "1",
      title: "Algorithms Championship",
      description: "Test your algorithmic skills in this 3-hour contest",
      date: "March 15, 2025",
      time: "2:00 PM - 5:00 PM",
      participants: 120,
      difficulty: "Medium",
      problems: 6,
    },
    {
      id: "2",
      title: "Data Structures Showdown",
      description: "Master data structures challenges in this competitive event",
      date: "March 22, 2025",
      time: "10:00 AM - 1:00 PM",
      participants: 85,
      difficulty: "Hard",
      problems: 5,
    },
    {
      id: "3",
      title: "Competitive Coding Cup",
      description: "The ultimate coding competition for college students",
      date: "April 5, 2025",
      time: "3:00 PM - 6:00 PM",
      participants: 150,
      difficulty: "Medium-Hard",
      problems: 7,
    },
  ]

  const ongoingContests = [
    {
      id: "4",
      title: "Weekly Challenge #43",
      description: "Solve weekly problems to improve your coding skills",
      date: "March 11, 2025",
      time: "10:00 AM - 1:00 PM",
      participants: 95,
      difficulty: "Easy-Medium",
      problems: 5,
      status: "ongoing",
    },
  ]

  const pastContests = [
    {
      id: "5",
      title: "Weekly Challenge #42",
      description: "Weekly coding problems for all skill levels",
      date: "March 1, 2025",
      time: "10:00 AM - 1:00 PM",
      participants: 110,
      difficulty: "Medium",
      problems: 6,
      status: "past",
    },
    {
      id: "6",
      title: "Data Structures Marathon",
      description: "A deep dive into data structures problems",
      date: "February 15, 2025",
      time: "2:00 PM - 6:00 PM",
      participants: 75,
      difficulty: "Hard",
      problems: 8,
      status: "past",
    },
  ]

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Contests</h1>
            </div>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingContests.map((contest) => (
                  <ContestCard key={contest.id} {...contest} />
                ))}
              </TabsContent>
              <TabsContent value="ongoing" className="space-y-6">
                {ongoingContests.map((contest) => (
                  <ContestCard key={contest.id} {...contest} />
                ))}
              </TabsContent>
              <TabsContent value="past" className="space-y-6">
                {pastContests.map((contest) => (
                  <ContestCard key={contest.id} {...contest} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}

