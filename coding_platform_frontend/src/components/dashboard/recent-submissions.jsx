import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RecentSubmissions({ submissions }) {
    return (
        <Card className="card-hover">
            <CardHeader className="pb-3">
                <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto">
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="text-left py-2 px-4">Problem</th>
                            <th className="text-left py-2 px-4">Status</th>
                            <th className="text-left py-2 px-4">Language</th>
                            <th className="text-left py-2 px-4">Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {submissions.map((submission, index) => (
                            <tr key={index}>
                                <td className="py-3 px-4">
                                    <Link to={`/editor/problem/${submission.problemId}`} className="text-primary hover:underline">
                                        {submission.problem}
                                    </Link>
                                </td>
                                <td className="py-3 px-4">
                                    {submission.status === true ? (
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Solved</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">Failed</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 capitalize">{submission.language}</td>
                                <td className="py-3 px-4">{new Date(submission.time).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
