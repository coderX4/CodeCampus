import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export default function RecentSubmissions({ submissions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  submission.status === "Accepted"
                    ? "bg-green-100 text-green-600"
                    : submission.status === "Wrong Answer"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {submission.status === "Accepted" ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <Link
                  to={`/problem/${submission.problemId}`}
                  className="text-sm font-medium leading-none hover:underline"
                >
                  {submission.problem}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {submission.language} • {submission.time}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p
                  className={`text-sm font-medium ${
                    submission.status === "Accepted"
                      ? "text-green-600"
                      : submission.status === "Wrong Answer"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {submission.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  {submission.runtime} • {submission.memory}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

