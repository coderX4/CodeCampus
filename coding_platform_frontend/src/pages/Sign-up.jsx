import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Github } from "lucide-react"
import {useAuth} from "@/AuthContext.jsx";
export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        agreeToTerms: false,
    })
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccessMessage("");
        setErrorMessage("");

        // Trim inputs
        const trimmedfirstname = formData.firstName.trim();
        const trimmedlastname = formData.lastName.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPassword = formData.password.trim();

        if (!trimmedfirstname || !trimmedlastname || !trimmedEmail || !trimmedPassword) {
            setErrorMessage("All fields are required!");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
            setErrorMessage("Invalid email format.");
            return;
        }

        if (trimmedPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        setFormData({
            firstName: trimmedfirstname ,
            lastName: trimmedlastname,
            email: trimmedEmail,
            password: trimmedPassword,
            agreeToTerms: true,
        })

        try {
            const response = await fetch(`http://localhost:8083/api/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }
            else{
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    agreeToTerms: false,
                });
                setSuccessMessage("Registration Successful!");

                setTimeout(async () => {
                    setSuccessMessage(""); // Clear success message
                    try {
                        const user = await response.json();
                        sessionStorage.setItem("user", JSON.stringify(user));
                    } catch {
                        console.warn("User data not returned as JSON");
                    }
                    await login();
                    navigate("/dashboard");
                }, 2000); // Delay of 3 seconds before navigating
            }
        } catch (error) {
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        }
    }

    const handleGoogleLogin = async () => {
        window.open("http://localhost:8083/oauth2/authorization/google", "_self");
    }


    return (
            <main className="flex-1 py-6 md:py-12 lg:py-6">
                <div className="container px-4 md:px-6">
                    <Card className="mx-auto max-w-md">
                        {successMessage && (
                            <div className="mr-2 ml-2 mt-3 mb-2 p-3 text-sm text-green-700 bg-green-50 border border-green-300 rounded-lg shadow-md">
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="mr-2 ml-2 mt-3 mb-2 p-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg shadow-md">
                                {errorMessage}
                            </div>
                        )}
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                            <CardDescription>Enter your information to get started with CodeCampus</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium leading-none">
                                            First Name
                                        </label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium leading-none">
                                            Last Name
                                        </label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none">
                                        Email
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
                                    <label htmlFor="password" className="text-sm font-medium leading-none">
                                        Password
                                    </label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked }))}
                                        required
                                    />
                                    <label
                                        htmlFor="agreeToTerms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the{" "}
                                        <Link to="/terms" className="text-primary hover:underline">
                                            terms of service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-primary hover:underline">
                                            privacy policy
                                        </Link>
                                    </label>
                                </div>
                                <Button type="submit" className="w-full" disabled={!formData.agreeToTerms}>
                                    Create Account
                                </Button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button onClick={handleGoogleLogin} variant="outline" type="button" className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                                        <path
                                            fill="#EA4335"
                                            d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                                        />
                                        <path
                                            fill="#4A90E2"
                                            d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                                    <Github className="h-5 w-5" />
                                    GitHub
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-center justify-center space-y-2">
                            <div className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>
    )
}

