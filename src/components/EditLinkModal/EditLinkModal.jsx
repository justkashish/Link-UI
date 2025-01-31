import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Switch, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { ToastContainer } from "react-toastify"
import { handleError, handleSuccess } from "../../utils"

function EditLinkModal({ isOpen, onClose, onSubmit, linkDetails }) {
  const uri = `${import.meta.env.VITE_BACKEND_URL}` // Backend API URL
  const [formData, setFormData] = useState({
    destinationUrl: "", // Stores the destination URL
    remarks: "", // Stores remarks for the link
    isExpirationEnabled: false, // Flag for expiration state
    expirationDate: new Date(), // Expiration date for the link
  })
  const [errors, setErrors] = useState({ destinationUrl: false, remarks: false }) // Form error states
  const token = localStorage.getItem("token") // Fetch the JWT token for authentication

  // Effect hook to populate form data when the modal opens or linkDetails change
  useEffect(() => {
    if (isOpen && linkDetails) {
      setFormData({
        destinationUrl: linkDetails.originalLink || "",
        remarks: linkDetails.remarks || "",
        isExpirationEnabled: !!linkDetails.expirationDate,
        expirationDate: linkDetails.expirationDate ? new Date(linkDetails.expirationDate) : new Date(),
      })
    }
  }, [isOpen, linkDetails])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Handle the toggle for expiration date
  const handleExpirationToggle = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      isExpirationEnabled: e.target.checked,
    }))
  }

  // Handle changes to the expiration date
  const handleDateChange = (newDate) => {
    setFormData((prevState) => ({
      ...prevState,
      expirationDate: newDate,
    }))
  }

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic form validation for required fields
    const newErrors = {
      destinationUrl: !formData.destinationUrl,
      remarks: !formData.remarks,
    }
    setErrors(newErrors)

    if (!newErrors.destinationUrl && !newErrors.remarks) {
      // Prepare data for updating the link
      const updatedData = {
        id: linkDetails?.id, // Pass the link ID for reference
        url: formData.destinationUrl,
        remark: formData.remarks,
        expirationDate: formData.isExpirationEnabled ? formData.expirationDate : null,
      }

      try {
        // Make the API call to update the link
        const response = await fetch(`${uri}/api/v1/link/edit/${linkDetails?.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Authorization token for API request
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData), // Pass the updated data in the body
        })

        const result = await response.json()

        // Handle success or failure based on the API response
        if (result.success) {
          handleSuccess("Link updated successfully") // Show success toast
          onSubmit(result.data) // Notify parent component with updated data
          onClose() // Close the modal
        } else {
          handleError(result.message || "Failed to update link") // Show error toast
        }
      } catch (error) {
        console.error("Error updating link:", error)
        handleError("Failed to update link") // Show error toast in case of network/API failure
      }
    }
  }

  // Clear form data and reset error states
  const handleClear = () => {
    setFormData({
      destinationUrl: linkDetails?.originalLink || "",
      remarks: linkDetails?.remarks || "",
      isExpirationEnabled: !!linkDetails?.expirationDate,
      expirationDate: linkDetails?.expirationDate ? new Date(linkDetails.expirationDate) : new Date(),
    })
    setErrors({ destinationUrl: false, remarks: false }) // Reset errors
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose} // Close the modal when the background is clicked or the close button is clicked
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "90vh", // Set the dialog height to 90% of the viewport height
          margin: "20px", // Add margin around the dialog
        },
      }}
      PaperProps={{
        style: {
          borderRadius: "8px", // Rounded corners for the dialog
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#3b3c51",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        Edit Link
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", flex: 1 }}>
        <form onSubmit={handleSubmit} className="space-y-6" style={{ flex: 1 }}>
          {/* Destination URL field */}
          <TextField
            fullWidth
            label="Destination Url"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleInputChange}
            placeholder="https://web.whatsapp.com/"
            error={errors.destinationUrl}
            helperText={errors.destinationUrl ? "Destination URL is required" : ""}
            sx={{ mt: 2 }}
            InputLabelProps={{
              required: true,
              style: { color: errors.destinationUrl ? "red" : "#343446" },
            }}
          />

          {/* Remarks field */}
          <TextField
            fullWidth
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Add remarks"
            multiline
            rows={4}
            error={errors.remarks}
            helperText={errors.remarks ? "Remarks are required" : ""}
            sx={{ mt: 3 }}
            InputLabelProps={{
              style: { color: errors.remarks ? "red" : "#343446" },
            }}
          />

          {/* Expiration toggle switch */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <span style={{ color: "#343446", fontSize: "1.1rem" }}>Link Expiration</span>
            <Switch
              checked={formData.isExpirationEnabled}
              onChange={handleExpirationToggle} // Toggle expiration state
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#1b48da", // Custom color for the checked state
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#1b48da", // Custom color for the track in the checked state
                },
              }}
            />
          </div>

          {/* Date Picker for expiration date */}
          {formData.isExpirationEnabled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={formData.expirationDate}
                onChange={handleDateChange} // Update the expiration date
                textField={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                components={{
                  OpenPickerIcon: CalendarTodayIcon,
                }}
                minDateTime={new Date()} // Ensure the date is not in the past
              />
            </LocalizationProvider>
          )}
          <ToastContainer /> {/* Toast notifications for success/error */}
        </form>
      </DialogContent>

      {/* Save and Clear buttons */}
      <div
        style={{
          padding: "16px 24px",
          backgroundColor: "rgba(59, 60, 81, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "auto",
        }}
      >
        <Button
          onClick={handleClear} // Reset the form to initial state
          sx={{
            color: "#6a6a6a",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              color: "#343446",
            },
            fontSize: "1.1rem",
            textTransform: "none",
          }}
        >
          Clear
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit} // Submit form data to the API
          sx={{
            backgroundColor: "#1b48da",
            "&:hover": {
              backgroundColor: "#1539b3",
            },
            fontSize: "1.1rem",
            px: 4,
            textTransform: "none",
          }}
        >
          Save
        </Button>
      </div>
    </Dialog>
  )
}

export default EditLinkModal
