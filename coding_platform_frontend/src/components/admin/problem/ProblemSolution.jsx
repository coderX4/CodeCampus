import { Label } from "@/components/ui/label.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"

export default function ProblemSolution({ formData, handleChange }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="approach">Solution Approach</Label>
                <Textarea
                    id="approach"
                    name="approach"
                    value={formData.approach}
                    onChange={handleChange}
                    placeholder="Provide a reference solution..."
                    className="min-h-[200px] font-mono"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="pseudocode">Pseudocode</Label>
                <Textarea
                    id="pseudocode"
                    name="pseudocode"
                    value={formData.pseudocode}
                    onChange={handleChange}
                    placeholder="Provide pseudocode for the solution..."
                    className="min-h-[200px] font-mono"
                />
            </div>
        </div>
    )
}

