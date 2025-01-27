import { useState, useEffect } from "react"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { toast } from "react-toastify"
import "./Settings.css"

export default function Settings() {
    const uri = `${import.meta.env.VITE_BACKEND_URL}`;
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/profile`)
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setFormData({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${uri}/api/v1/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${uri}/api/v1/profile/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      })

      window.location.href = "/"
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="settings-container">
        <Card className="settings-card">
          <CardContent className="settings-card-content">
            <div className="loading-message">Loading profile data...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="settings-container">
      <Card className="settings-card">
        <CardContent className="settings-card-content">
          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email id</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile no.</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="save-button" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                variant="destructive"
                className="delete-button"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

