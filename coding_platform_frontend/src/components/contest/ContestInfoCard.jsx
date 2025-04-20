import { Card, CardContent } from "@/components/ui/card.jsx"
import { Calendar, Clock, Users } from "lucide-react"

export default function ContestInfoCard({ contest }) {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "TBA"
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Format time for display
    const formatTime = (timeString, durationHours) => {
        if (!timeString || !durationHours) return "TBA"

        const [hours, minutes] = timeString.split(":")
        const startDateTime = new Date()
        startDateTime.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0)

        const endDateTime = new Date(startDateTime)
        endDateTime.setHours(endDateTime.getHours() + Number.parseInt(durationHours, 10))

        const formatTimeStr = (date) => {
            return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
        }

        return `${formatTimeStr(startDateTime)} - ${formatTimeStr(endDateTime)}`
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <p>{formatDate(contest.startDate)}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <p>{formatTime(contest.startTime, contest.duration?.split(" ")[0])}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                        <p>{contest.duration || "TBA"} hr</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Participants</h3>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{contest.participants || 0}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
