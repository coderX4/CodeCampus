import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"

export default function ContestFilters({ searchQuery, setSearchQuery, difficultyFilter, setDifficultyFilter }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="h-9 w-[130px]">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
