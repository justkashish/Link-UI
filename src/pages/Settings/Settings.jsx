import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from '../../utils';
import "react-toastify/dist/ReactToastify.css";
import "./Settings.css";
import { use } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        console.log(token);
        const response = await fetch(`${uri}/api/v1/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobileNo: data.mobileNo || "",
        });
        console.log("Form data updated successfully.");
      } catch (error) {
        handleError("Failed to load profile data. Please refresh the page.");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${uri}/api/v1/profile/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      console.log("Your profile has been updated.");

      handleSuccess("Your profile has been updated.");
    } catch (error) {
      handleError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`${uri}/api/v1/profile/delete`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
      }
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      handleSuccess("Your account has been successfully deleted.");
     localStorage.removeItem("token");
     localStorage.removeItem("loggedInUser");
     console.log("User Logged out successfully");
     handleSuccess("User Logged out");
     setTimeout(() => {
      navigate("/login");
    }, 1000);
    } catch (error) {
     
      handleError("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="settings-container">
        <Card className="settings-card">
          <CardContent className="settings-card-content">
            <div className="loading-message">Loading profile data...</div>
          </CardContent>
        </Card>
      </div>
    );
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Id</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile No.</label>
              <input
                id="mobileNo"
                name="mobileNo"
                type="tel"
                value={formData.mobileNo}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="save-button"
                disabled={isLoading}
              >
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
          <ToastContainer />
        </CardContent>
      </Card>
    </div>
  );
}
