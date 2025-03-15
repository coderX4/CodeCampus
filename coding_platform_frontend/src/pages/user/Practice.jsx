import { Input } from "../../components/ui/input.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.jsx"
import { Search } from "lucide-react"
import { Badge } from "../../components/ui/badge.jsx"
import { Button } from "../../components/ui/button.jsx"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card.jsx"
import { Link } from "react-router-dom"

export default function Practice() {
  // Mock problems data
  const problems = [
    {
      id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      acceptance: "45%",
      solved: true,
    },
    {
      id: "2",
      title: "Add Two Numbers",
      difficulty: "Medium",
      tags: ["Linked List", "Math"],
      acceptance: "38%",
      solved: true,
    },
    {
      id: "3",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      tags: ["String", "Sliding Window"],
      acceptance: "32%",
      solved: false,
    },
    {
      id: "4",
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      tags: ["Array", "Binary Search"],
      acceptance: "25%",
      solved: false,
    },
    {
      id: "5",
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      tags: ["String", "Dynamic Programming"],
      acceptance: "31%",
      solved: false,
    },
    {
      id: "6",
      title: "Zigzag Conversion",
      difficulty: "Medium",
      tags: ["String"],
      acceptance: "40%",
      solved: false,
    },
    {
      id: "7",
      title: "Reverse Integer",
      difficulty: "Medium",
      tags: ["Math"],
      acceptance: "26%",
      solved: true,
    },
    {
      id: "8",
      title: "String to Integer (atoi)",
      difficulty: "Medium",
      tags: ["String", "Math"],
      acceptance: "16%",
      solved: false,
    },
  ]

  const arrayProblems = problems.filter((p) => p.tags.includes("Arrays") || p.tags.includes("Array"))

  function ProblemCard({ id, title, difficulty, tags, acceptance, solved }) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{id}.</span>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <Badge
              className={
                difficulty === "Easy"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
              }
              variant="outline"
            >
              {difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Acceptance: {acceptance}</span>
            {solved && (
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                Solved
              </Badge>
            )}
          </div>
          <Button size="sm" asChild>
            <Link to={`/editor/problem/${id}`}>Solve</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Practice Problems</h1>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search problems..." className="pl-8" />
              </div>
            </div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="arrays">Arrays</TabsTrigger>
                <TabsTrigger value="strings">Strings</TabsTrigger>
                <TabsTrigger value="linked-lists">Linked Lists</TabsTrigger>
                <TabsTrigger value="trees">Trees</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {problems.map((problem) => (
                    <ProblemCard key={problem.id} {...problem} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="arrays" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {arrayProblems.map((problem) => (
                    <ProblemCard key={problem.id} {...problem} />
                  ))}
                </div>
              </TabsContent>
              {/* Other tab contents would follow the same pattern */}
            </Tabs>
          </div>
        </div>
      </main>
  )
}

