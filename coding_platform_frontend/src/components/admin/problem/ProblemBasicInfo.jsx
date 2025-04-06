import { Label } from "@/components/ui/label.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Checkbox } from "@/components/ui/checkbox.jsx"

export default function ProblemBasicInfo({
                                             formData,
                                             handleChange,
                                             handleDifficultyChange,
                                             handleTagToggle,
                                             tagOptions,
                                             capitalizedDifficulty,
                                         }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Problem Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter problem title"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty || ""} onValueChange={handleDifficultyChange}>
                        <SelectTrigger id="difficulty">
                            <SelectValue placeholder={capitalizedDifficulty || "Select difficulty"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {tagOptions.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                                id={`tag-${tag}`}
                                checked={formData.tags.includes(tag)}
                                onCheckedChange={() => handleTagToggle(tag)}
                            />
                            <Label
                                htmlFor={`tag-${tag}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {tag}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

