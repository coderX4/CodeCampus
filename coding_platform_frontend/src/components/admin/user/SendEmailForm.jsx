import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { X, Mail, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge.jsx"
import {baseUrl} from "@/utils/index.js";

export default function SendEmailForm({ recipients, onCancel, onSuccess, onError }) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    })

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const storedUser = sessionStorage.getItem("user")
        const loggeduser = storedUser ? JSON.parse(storedUser) : null

        try {
            // Prepare the email data
            const emailData = {
                recipients: recipients.map((r) => r.email),
                subject: formData.subject,
                message: formData.message,
            }

            // Send the email
            const response = await fetch(baseUrl+"/api/admin/sendmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggeduser.token}`,
                },
                body: JSON.stringify(emailData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to send email")
            }

            onSuccess("Email sent successfully!")
        } catch (err) {
            onError(err.message || "Failed to send email")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Send Email</CardTitle>
                        <CardDescription>Compose an email to send to selected users</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Recipients ({recipients.length})</label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/20 max-h-24 overflow-y-auto">
                            {recipients.map((recipient) => (
                                <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {recipient.email}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleFormChange}
                            placeholder="Enter email subject"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                            Message
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            placeholder="Enter your message"
                            className="min-h-[200px]"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                            {isLoading ? (
                                <>
                  <span className="mr-2">
                    <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      ></circle>
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Email
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

