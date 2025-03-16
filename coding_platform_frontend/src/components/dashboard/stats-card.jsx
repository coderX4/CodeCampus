import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsCard({ title, value, description, icon }) {
    return (
        <Card className="card-hover overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}

