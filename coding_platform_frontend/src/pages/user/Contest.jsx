import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { ArrowLeft, CheckCircle, Clock, Trophy, Users } from "lucide-react"
import Header from "../../components/layout/header.jsx"
import Footer from "../../components/layout/footer.jsx"

export default function Contest() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("problems")

  // Mock contest data
  const contest = {
    id: id,
    title: "Algorithms Championship",
    description: "Test your algorithmic skills in this 3-hour contest",
    startTime: "March 15, 2025 2:00 PM",
    endTime: "March 15, 2025 5:00 PM",
    status: "upcoming", // upcoming, ongoing, ended
    participants: 120,
    problems: [
      {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        solved: false,
      },
      {
        id: "2",
        title: "Valid Parentheses",
        difficulty: "Easy",
        solved: false,
      },
      {
        id: "3",
        title: "Merge Two Sorted Lists",
        difficulty: "Medium",
        solved: false,
      },
      {
        id: "4",
        title: "Maximum Subarray",
        difficulty: "Medium",
        solved: false,
      },
      {
        id: "5",
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        solved: false,
      },
      {
        id: "6",
        title: "Word Search",
        difficulty: "Hard",
        solved: false,
      },
    ],
  }

  return (
      <main className="flex-1">
        <div className="container py-4">
          <div className="mb-4">
            <Link to="/contests" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Contests
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{contest.title}</h1>
                <p className="text-muted-foreground">{contest.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  <Clock className="mr-1 h-4 w-4" />
                  {contest.status === "upcoming"
                    ? "Starts in 4 days"
                    : contest.status === "ongoing"
                      ? "Ends in 2h 30m"
                      : "Ended"}
                </Badge>
                <Button>
                  {contest.status === "upcoming"
                    ? "Register"
                    : contest.status === "ongoing"
                      ? "Enter Contest"
                      : "View Results"}
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
                    <p>{contest.startTime}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">End Time</h3>
                    <p>{contest.endTime}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Participants</h3>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{contest.participants}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="problems">Problems</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>
              <TabsContent value="problems" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contest Problems</CardTitle>
                    <CardDescription>
                      {contest.status === "upcoming"
                        ? "Problems will be available when the contest starts"
                        : `${contest.problems.length} problems to solve`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contest.status === "upcoming" ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground">
                          Problems will be revealed when the contest starts.
                          <br />
                          Make sure to register before the contest begins!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {contest.problems.map((problem, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div>
                                <p className="font-medium">{problem.title}</p>
                                <Badge
                                  className={
                                    problem.difficulty === "Easy"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : problem.difficulty === "Medium"
                                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                        : "bg-red-100 text-red-800 hover:bg-red-100"
                                  }
                                  variant="outline"
                                >
                                  {problem.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {problem.solved ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Solved
                                </Badge>
                              ) : (
                                <Button size="sm" asChild>
                                  <Link to={`/problem/${problem.id}`}>Solve</Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contest Leaderboard</CardTitle>
                    <CardDescription>
                      {contest.status === "upcoming"
                        ? "Leaderboard will be available when the contest starts"
                        : "Current standings"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contest.status === "upcoming" ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground">
                          Leaderboard will be available once the contest begins.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 md:gap-8">
                            <div className="w-12 text-center font-bold">#</div>
                            <div className="flex-1 md:flex-none md:w-64">User</div>
                            <div className="w-20 text-center">Solved</div>
                            <div className="w-20 text-center">Score</div>
                            <div className="w-20 text-center">Time</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {/* Leaderboard entries would go here */}
                          <p className="text-center text-muted-foreground py-8">No entries yet</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="rules" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contest Rules</CardTitle>
                    <CardDescription>Please read carefully before participating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">General Rules</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>The contest will last for 3 hours.</li>
                          <li>There are 6 problems of varying difficulty.</li>
                          <li>You can submit solutions in Python, Java, C++, or JavaScript.</li>
                          <li>Each problem has a different point value based on its difficulty.</li>
                          <li>Partial points may be awarded for partially correct solutions.</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Scoring</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Easy problems: 100 points each</li>
                          <li>Medium problems: 200 points each</li>
                          <li>Hard problems: 300 points each</li>
                          <li>Time penalties: -10 points for each incorrect submission</li>
                          <li>Bonus: +50 points for solving all problems</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Code of Conduct</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Do not share solutions during the contest.</li>
                          <li>Do not use multiple accounts.</li>
                          <li>
                            External resources like documentation are allowed, but not solutions to the specific
                            problems.
                          </li>
                          <li>Plagiarism will result in disqualification.</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}

