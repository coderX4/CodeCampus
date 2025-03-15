import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/AuthContext.jsx";

const OauthCallback = () => {
    const { email } = useParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthLogin = async () => {
            try {
                const response = await fetch(`http://localhost:8083/api/auth/oauth-success/${email}`, {
                    method: "GET",
                    credentials: "include", // Ensure cookies are sent
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    throw new Error("Login failed. Please try again.");
                }

                const user = await response.json();
                sessionStorage.setItem("user", JSON.stringify(user));
                await login();
                if(user.role === "ADMIN"){
                    navigate("/admin-dashboard");
                }
                else{
                    navigate("/dashboard");
                }
            } catch (error) {
                console.warn("User data not returned as JSON", error);
                navigate("/home"); // Redirect to login on failure
            }
        };

        handleOAuthLogin();
    }, [email, login, navigate]);

    return <div>Logging in...</div>; // Show a loading message while redirecting
};

export default OauthCallback;
