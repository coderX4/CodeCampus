import { useState } from "react"
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react"
import {baseUrl} from "@/utils/index.js";
import {useToast} from "@/hooks/use-toast.js";

export default function ContactUs() {
    const [isLoading, setIsLoading] = useState(false)
    // Toast notifications
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const storedUser = sessionStorage.getItem("user")
        const loggeduser = storedUser ? JSON.parse(storedUser) : null

        try {
            // Send the email
            const response = await fetch(baseUrl+"/api/auth/sendmail", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to send email")
            }
            // Success
            toast({
                title: "Email sent successfully!",
                description: "Email is sent to "+formData.email+" .",
            })
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            })
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send email",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Contact Us</h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    Have questions or feedback? We'd love to hear from you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form and Info Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            {/* Contact Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send Us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium leading-none">
                                                Your Name
                                            </label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                                Email Address
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium leading-none">
                                                Subject
                                            </label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="How can we help you?"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium leading-none">
                                                Message
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Please provide as much detail as possible..."
                                                className="min-h-[150px]"
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tighter mb-4">Get in Touch</h2>
                                    <p className="text-muted-foreground">
                                        We're here to help with any questions about our platform, contests, or how to get started. Reach out
                                        to us through any of the following channels.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Mail className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-bold">Email Us</h3>
                                            <p className="text-muted-foreground mb-1">Developer Mail:</p>
                                            <p>deepghosh146@gmail</p>
                                            <p className="text-muted-foreground mb-1 mt-2">For support:</p>
                                            <p>9otesapp@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Phone className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-bold">Call Us</h3>
                                            <p className="text-muted-foreground mb-1">Monday to Friday, 9am to 5pm IST</p>
                                            <p>+91 9311084135</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <MapPin className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-bold">Visit Us</h3>
                                            <p className="text-muted-foreground mb-1">Our headquarters:</p>
                                            <p>Delhi</p>
                                            <p>India, New Delhi</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Frequently Asked Questions
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium">How do I join a contest?</h4>
                                            <p className="text-muted-foreground">
                                                Register for an account, browse the contests page, and click "Register" on any upcoming contest.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Is CodeCampus free for students?</h4>
                                            <p className="text-muted-foreground">
                                                Yes, we offer a free tier with access to basic features. Premium features are available through
                                                school partnerships or individual subscriptions.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Can I use CodeCampus for my classroom?</h4>
                                            <p className="text-muted-foreground">
                                                We offer special educator accounts with additional features for classroom management.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
    )
}

