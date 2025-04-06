import { Label } from "@/components/ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"

export default function ProblemStatus({ status, setStatus, capitalizedStatus }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={status} value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                    <SelectValue placeholder={capitalizedStatus || "Select status"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

