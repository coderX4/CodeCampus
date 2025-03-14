import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Trophy } from "lucide-react"
import Header from "../components/layout/header"
import Footer from "../components/layout/footer"

export default function Leaderboard() {
  const [contestFilter, setContestFilter] = useState("weekly42")
  const [departmentFilter, setDepartmentFilter] = useState("cs")

  // Mock users data
  const users = [
    {
      rank: 1,
      name: "Alex Johnson",
      username: "alexcode",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 145,
      contests: 24,
      score: 9850,
    },
    {
      rank: 2,
      name: "Samantha Lee",
      username: "samcodes",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 132,
      contests: 20,
      score: 9340,
    },
    {
      rank: 3,
      name: "Michael Chen",
      username: "mikedev",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 128,
      contests: 22,
      score: 9120,
    },
    {
      rank: 4,
      name: "Emily Rodriguez",
      username: "emilyr",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 120,
      contests: 18,
      score: 8750,
    },
    {
      rank: 5,
      name: "David Kim",
      username: "davek",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 115,
      contests: 19,
      score: 8600,
    },
    {
      rank: 6,
      name: "Jessica Wang",
      username: "jwang",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 110,
      contests: 16,
      score: 8320,
    },
    {
      rank: 7,
      name: "Ryan Patel",
      username: "ryanp",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 105,
      contests: 15,
      score: 8100,
    },
    {
      rank: 8,
      name: "John Doe",
      username: "johnd",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 98,
      contests: 14,
      score: 7850,
      isCurrentUser: true,
    },
  ]

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline">This Month</Button>
                <Button variant="outline">
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
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 md:gap-8">
                          <div className="w-12 md:w-16 text-center font-bold">#</div>
                          <div className="flex-1 md:flex-none md:w-64">User</div>
                          <div className="hidden md:block w-32 text-center">Problems Solved</div>
                          <div className="hidden md:block w-32 text-center">Contests</div>
                          <div className="w-20 md:w-32 text-center">Score</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {users.map((user) => (
                          <div
                            key={user.rank}
                            className={`flex justify-between items-center p-4 rounded-lg ${
                              user.isCurrentUser ? "bg-primary/10" : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex gap-4 md:gap-8 items-center">
                              <div className="w-12 md:w-16 text-center font-bold">
                                {user.rank === 1 ? (
                                  <Trophy className="h-6 w-6 text-yellow-500 mx-auto" />
                                ) : user.rank === 2 ? (
                                  <Trophy className="h-6 w-6 text-gray-400 mx-auto" />
                                ) : user.rank === 3 ? (
                                  <Trophy className="h-6 w-6 text-amber-700 mx-auto" />
                                ) : (
                                  user.rank
                                )}
                              </div>
                              <div className="flex items-center gap-3 flex-1 md:flex-none md:w-64">
                                <Avatar>
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                                {user.isCurrentUser && (
                                  <Badge variant="outline" className="ml-2">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="hidden md:block w-32 text-center">{user.solved}</div>
                              <div className="hidden md:block w-32 text-center">{user.contests}</div>
                              <div className="w-20 md:w-32 text-center font-bold">{user.score}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="contests" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Contest Rankings</CardTitle>
                      <CardDescription>Top performers in the selected contest</CardDescription>
                    </div>
                    <Select value={contestFilter} onValueChange={setContestFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select contest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly42">Weekly Challenge #42</SelectItem>
                        <SelectItem value="datastructures">Data Structures Marathon</SelectItem>
                        <SelectItem value="algorithms">Algorithms Showdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    {/* Contest leaderboard content would go here, similar to global */}
                    <p className="text-center text-muted-foreground py-8">Select a contest to view rankings</p>
                  </CardContent>
                </Card>
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
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="it">Information Technology</SelectItem>
                        <SelectItem value="ece">Electronics & Communication</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    {/* Department leaderboard content would go here, similar to global */}
                    <p className="text-center text-muted-foreground py-8">Select a department to view rankings</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}

