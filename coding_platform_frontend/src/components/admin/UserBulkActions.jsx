import { Button } from "@/components/ui/button.jsx"
import { UserPlus2, Mail, Shield, UserMinus, Trash2 } from "lucide-react"

export default function UserBulkActions({
                                            selectedCount,
                                            onSendEmail,
                                            onChangeRole,
                                            onActivate,
                                            onDeactivate,
                                            onDelete,
                                        }) {
    return (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg bg-background p-4 shadow-lg border">
            <span className="text-sm font-medium">{selectedCount} users selected</span>
            <Button size="sm" variant="outline" onClick={onSendEmail}>
                <Mail className="mr-1 h-4 w-4" /> Email
            </Button>
            <Button size="sm" variant="outline" onClick={onChangeRole}>
                <Shield className="mr-1 h-4 w-4" /> Change Role
            </Button>
            <Button size="sm" variant="outline" onClick={onActivate}>
                <UserPlus2 className="mr-1 h-4 w-4" /> Activate
            </Button>
            <Button size="sm" variant="outline" onClick={onDeactivate}>
                <UserMinus className="mr-1 h-4 w-4" /> Deactivate
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
        </div>
    )
}

