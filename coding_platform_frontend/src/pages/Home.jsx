import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock, Code, Trophy, Users, CheckCircle, ArrowRight, Github } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {useAuth} from "@/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Mock upcoming contests data
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
      title: "Weekly Challenge #43",
      description: "Solve weekly problems to improve your coding skills",
      date: "March 11, 2025",
      time: "10:00 AM - 1:00 PM",
      participants: 95,
      difficulty: "Easy-Medium",
      problems: 5,
    },
  ]

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Alex Johnson",
      username: "alexcode",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 145,
      score: 9850,
    },
    {
      rank: 2,
      name: "Samantha Lee",
      username: "samcodes",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 132,
      score: 9340,
    },
    {
      rank: 3,
      name: "Michael Chen",
      username: "mikedev",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 128,
      score: 9120,
    },
    {
      rank: 4,
      name: "Emily Rodriguez",
      username: "emilyr",
      avatar: "/placeholder.svg?height=40&width=40",
      solved: 120,
      score: 8750,
    },
  ]

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const loginData = { email, password };

    try {
      const response = await fetch(`http://localhost:8083/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        let role;
        try {
          const user = await response.json();
          sessionStorage.setItem("user", JSON.stringify(user));
          role = user.role;
        } catch {
          console.warn("User data not returned as JSON");
        }
        await login();
        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        }
        else{
          navigate("/dashboard");
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: "Login failed!" }));
        setError(errorData.message || "Login Failed, Please retry!");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleGoogleLogin = async () => {
    window.open("http://localhost:8083/oauth2/authorization/google", "_self");
  };

  return (
        <main className="flex-1">
          {/* Hero Section with Login Form */}
          <section className="w-full py-6 md:py-12 lg:py-16 bg-gradient-to-b from-background to-muted">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                        Enhance Your Coding Skills
                      </h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        Practice DSA problems, participate in contests, and track your progress all in one place.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button size="lg" asChild>
                        <Link to="/practice">Explore Problems</Link>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <Link to="/contests">View Contests</Link>
                      </Button>
                    </div>
                  </div>
                  <Card className="w-full max-w-md mx-auto">
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <CardHeader>
                      <CardTitle>Sign In</CardTitle>
                      <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <label
                              htmlFor="email"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Email
                          </label>
                          <Input
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Password
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <Input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Sign In
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button onClick={handleGoogleLogin} variant="outline" type="button" className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                              <path
                                  fill="#EA4335"
                                  d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                              />
                              <path
                                  fill="#34A853"
                                  d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                              />
                              <path
                                  fill="#4A90E2"
                                  d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                              />
                              <path
                                  fill="#FBBC05"
                                  d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                              />
                            </svg>
                            Google
                          </Button>
                          <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                            <Github className="h-5 w-5" />
                            GitHub
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center justify-center space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline">
                          Register
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
          </section>

          {/* Upcoming Contests Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Contests</h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Don't miss out on these exciting coding challenges
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingContests.map((contest) => (
                    <Card key={contest.id} className="flex flex-col h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{contest.title}</CardTitle>
                          <Badge variant="outline">{contest.difficulty}</Badge>
                        </div>
                        <CardDescription>{contest.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                          {contest.date} • {contest.time}
                        </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{contest.participants} participants</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span>{contest.problems} problems</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link to={`/contest/${contest.id}`}>Register</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contests" className="flex items-center gap-2">
                    View All Contests <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Leaderboard Preview Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leaderboard</h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    Top performers across all challenges and contests
                  </p>
                </div>
              </div>
              <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle>Global Rankings</CardTitle>
                  <CardDescription>Top performers across all challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                      <div className="w-16 text-center">Rank</div>
                      <div className="flex-1">User</div>
                      <div className="w-24 text-center">Problems</div>
                      <div className="w-24 text-center">Score</div>
                    </div>
                    <div className="space-y-4">
                      {leaderboardData.map((user) => (
                          <div key={user.rank} className="flex justify-between items-center p-4 rounded-lg hover:bg-muted">
                            <div className="w-16 text-center font-bold">
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
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">@{user.username}</p>
                              </div>
                            </div>
                            <div className="w-24 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{user.solved}</span>
                              </div>
                            </div>
                            <div className="w-24 text-center font-bold">{user.score}</div>
                          </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/leaderboard" className="flex items-center gap-2">
                      View Full Leaderboard <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What is CodeCampus?</h2>
                  <p className="max-w-[800px] text-muted-foreground md:text-xl">
                    CodeCampus is a comprehensive platform designed to help college students master coding skills through
                    practice, competition, and community.
                  </p>
                </div>
              </div>
              <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
                <Card>
                  <CardHeader>
                    <Code className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Learn by Doing</CardTitle>
                    <CardDescription>Master data structures and algorithms through hands-on practice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our platform offers a structured learning path with hundreds of carefully curated problems organized
                      by topic and difficulty. Each problem comes with detailed explanations and multiple solution
                      approaches to deepen your understanding.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Trophy className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Compete and Grow</CardTitle>
                    <CardDescription>Challenge yourself in competitive programming contests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Regular contests simulate real interview conditions and competitive programming environments.
                      Compete with peers, improve your problem-solving speed, and learn from top performers to
                      continuously enhance your skills.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Users className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Community and Collaboration</CardTitle>
                    <CardDescription>Connect with like-minded programmers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Join a thriving community of student programmers. Discuss solutions, share insights, and collaborate
                      on complex problems. Our platform facilitates peer learning and networking with future tech
                      professionals.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  CodeCampus is trusted by students from over 100 colleges nationwide to prepare for technical interviews,
                  competitive programming contests, and to build a strong foundation in computer science fundamentals.
                </p>
                <Button size="lg" asChild>
                  <Link to="/signup">Join CodeCampus Today</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
  )
}

