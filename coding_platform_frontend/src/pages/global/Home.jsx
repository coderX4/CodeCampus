import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Code, Trophy, Users, Github } from "lucide-react"
import {useAuth} from "@/utils/AuthContext.jsx";
import {baseUrl} from "@/utils/index.js";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const loginData = { email, password };

    try {
      const response = await fetch(baseUrl+`/api/auth/login`, {
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
    window.open(baseUrl+"/oauth2/authorization/google", "_self");
  };

  const handleGithubLogin = async () => {
    window.open(baseUrl+"/oauth2/authorization/github", "_self");
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
                      <blockquote className="mt-6 italic text-muted-foreground text-base">
                        "Code is like humor. When you have to explain it, it’s bad." – Cory House
                      </blockquote>
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
                          <Button onClick={handleGithubLogin} variant="outline" type="button" className="flex items-center justify-center gap-2">
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

