import { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Switch } from "@/components/ui/switch.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"

export default function EditorSettingsDialog({ settings, onSettingsChange, onClose }) {
    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value }
        onSettingsChange(newSettings)
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editor Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <Switch
                        id="auto-save"
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                        aria-label="Toggle auto save"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="word-wrap">Word Wrap</Label>
                    <Switch
                        id="word-wrap"
                        checked={settings.wordWrap}
                        onCheckedChange={(checked) => updateSetting("wordWrap", checked)}
                        aria-label="Toggle word wrap"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="line-numbers">Line Numbers</Label>
                    <Switch
                        id="line-numbers"
                        checked={settings.lineNumbers}
                        onCheckedChange={(checked) => updateSetting("lineNumbers", checked)}
                        aria-label="Toggle line numbers"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="tab-size">Tab Size</Label>
                    <Select value={settings.tabSize} onValueChange={(value) => updateSetting("tabSize", value)}>
                        <SelectTrigger id="tab-size" className="w-24">
                            <SelectValue placeholder="Tab Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">2 spaces</SelectItem>
                            <SelectItem value="4">4 spaces</SelectItem>
                            <SelectItem value="8">8 spaces</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                        <SelectTrigger id="theme" className="w-24">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vs-dark">Dark</SelectItem>
                            <SelectItem value="vs-light">Light</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogClose asChild>
                <Button type="button" onClick={onClose}>
                    Apply Settings
                </Button>
            </DialogClose>
        </DialogContent>
    )
}

