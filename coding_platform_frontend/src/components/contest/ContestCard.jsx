import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Clock, Users, Calendar } from "lucide-react"

export default function ContestCard({
                                        id,
                                        title,
                                        description,
                                        startDate,
                                        startTime,
                                        duration,
                                        status,
                                        participants,
                                        difficulty,
                                    }) {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "TBA"
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return "TBA"
        const [hours, minutes] = timeString.split(":")
        const date = new Date()
        date.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0)
        return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    }

    // Get difficulty badge color
    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "bg-green-100 text-green-800 hover:bg-green-100"
            case "medium":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            case "hard":
                return "bg-red-100 text-red-800 hover:bg-red-100"
            default:
                return ""
        }
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {difficulty && (
                        <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                            {difficulty}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{description}</p>
                <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
              {formatTime(startTime)} • {duration}
            </span>
                    </div>
                    {participants !== undefined && (
                        <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{participants} participants</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between items-center w-full">
                    <Badge
                        variant="outline"
                        className={
                            status === "upcoming"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : status === "ongoing"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                    >
                        {status === "upcoming" ? "Upcoming" : status === "ongoing" ? "Ongoing" : "Past"}
                    </Badge>
                    <Button asChild>
                        <Link to={`/dashboard/contest/${id}`}>View Details</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
