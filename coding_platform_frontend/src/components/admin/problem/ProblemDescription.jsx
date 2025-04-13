import { Label } from "@/components/ui/label.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Button } from "@/components/ui/button.jsx"

export default function ProblemDescription({ formData, handleChange, handleExampleChange, addExample, removeExample }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="about">Problem Description</Label>
                <Textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Describe the problem in detail..."
                    className="min-h-[150px]"
                    required
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Examples</Label>
                    {formData.examples.length < 3 && (
                        <Button type="button" variant="outline" onClick={addExample} size="sm">
                            Add Example
                        </Button>
                    )}
                </div>
                <div className="space-y-4">
                    {formData.examples.map((ex, index) => (
                        <div key={index} className="p-3 border rounded space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Example {index + 1}</Label>
                                {formData.examples.length > 1 && (
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeExample(index)}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`input-${index}`}>Input</Label>
                                <Input
                                    id={`input-${index}`}
                                    value={ex.input}
                                    onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                                    placeholder="Input"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`output-${index}`}>Output</Label>
                                <Input
                                    id={`output-${index}`}
                                    value={ex.output}
                                    onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                                    placeholder="Output"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`explanation-${index}`}>Explanation (optional)</Label>
                                <Input
                                    id={`explanation-${index}`}
                                    value={ex.explanation}
                                    onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                                    placeholder="Explanation"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="constraints">Constraints</Label>
                <Textarea
                    id="constraints"
                    name="constraints"
                    value={formData.constraints}
                    onChange={handleChange}
                    placeholder="Enter constraints (one per line)..."
                    className="min-h-[100px]"
                    required
                />
            </div>
        </div>
    )
}

