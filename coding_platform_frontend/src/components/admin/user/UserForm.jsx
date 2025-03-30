import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card.jsx"
import { Input } from "../../ui/input.jsx"
import { Button } from "../../ui/button.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select.jsx"

export default function UserForm({ editingUser, onCancel, onSuccess, onError }) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
    })
    // Initialize form data when editing user
    useEffect(() => {
        if (editingUser) {
            const name = editingUser.uname;
            const [fName, lName] = name.split(" ");
            setFormData({
                firstName: fName || "",
                lastName: lName || "",
                email: editingUser.email || "",
                password: "", // Don't set password for editing
                role: editingUser.role || "USER",
            })
        }
    }, [editingUser])

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
            // Determine if we're creating or updating a user
            const url = editingUser
                ? `http://localhost:8083/api/admin/updateuser/${editingUser.email}`
                : "http://localhost:8083/api/admin/createuser"

            const method = editingUser ? "PUT" : "POST"

            // For updates, only include password if it was changed
            const body =
                editingUser && !formData.password
                    ? {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        role: formData.role,
                    }
                    : formData

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${loggeduser.token}`,
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || (editingUser ? "Failed to update user" : "Failed to create user"))
            }

            onSuccess(editingUser ? "User updated successfully!" : "User created successfully!")
        } catch (err) {
            onError(err.message || (editingUser ? "Failed to update user" : "Failed to create user"))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{editingUser ? "Edit User" : "Add New User"}</CardTitle>
                <CardDescription>{editingUser ? "Update user details" : "Create a new user account"}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium">
                                First Name
                            </label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium">
                                Last Name
                            </label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormChange}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="Enter email address"
                            disabled={editingUser != null}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                            </label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleFormChange}
                                placeholder={editingUser ? "Enter new password (optional)" : "Create password"}
                                required={!editingUser}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">
                                Role
                            </label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
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
                                    Processing...
                                </>
                            ) : editingUser ? (
                                "Update User"
                            ) : (
                                "Create User"
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

