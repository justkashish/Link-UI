import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Switch,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { ToastContainer } from "react-toastify"
import { handleError, handleSuccess } from "../../utils"

function NewLinkModal({ isOpen, onClose, onSubmit }) {
  const uri = `${import.meta.env.VITE_BACKEND_URL}` // Backend API URL
  const [formData, setFormData] = useState({
    destinationUrl: "", // Stores the destination URL
    remarks: "", // Stores any remarks for the link
    isExpirationEnabled: false, // Flag to indicate if expiration date is enabled
    expirationDate: new Date(), // Stores the expiration date (initially set to current date)
  })
  const [errors, setErrors] = useState({
    destinationUrl: false, // Error state for URL field
    remarks: false, // Error state for remarks field
  })
  const token = localStorage.getItem("token") // JWT token for API authentication
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")) // Check if the screen is small for responsive design

  // Effect hook to reset form data when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        destinationUrl: "",
        remarks: "",
        isExpirationEnabled: false,
        expirationDate: new Date(),
      })
      setErrors({ destinationUrl: false, remarks: false }) // Reset errors when modal closes
    }
  }, [isOpen])

  // Handle input changes for both destination URL and remarks fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update the specific field in form data
    }))
  }

  // Validate the URL entered by the user using a regex pattern
  const validateUrl = (str) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i",
    )
    return !!pattern.test(str) // Returns true if the URL matches the pattern
  }

  // Handle the toggle for enabling/disabling the expiration date
  const handleExpirationToggle = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      isExpirationEnabled: e.target.checked, // Set expiration enabled state based on the switch
    }))
  }

  // Handle change of the expiration date value
  const handleDateChange = (newDate) => {
    setFormData((prevState) => ({
      ...prevState,
      expirationDate: newDate, // Update expiration date value
    }))
  }

  // Handle form submission to create a new link
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate the URL and remarks fields
    const newErrors = {
      destinationUrl: !validateUrl(formData.destinationUrl), // Check if URL is valid
      remarks: !formData.remarks, // Check if remarks are provided
    }
    setErrors(newErrors) // Set error states based on validation

    // If no validation errors, proceed to submit the form data
    if (!newErrors.destinationUrl && !newErrors.remarks) {
      const data = {
        url: formData.destinationUrl,
        remark: formData.remarks,
        expirationDate: formData.isExpirationEnabled ? formData.expirationDate : null, // Set expiration date if enabled
      }

      try {
        // Make API request to create the new link
        const response = await fetch(`${uri}/api/v1/link/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
            "Content-Type": "application/json", // Specify content type as JSON
          },
          body: JSON.stringify(data), // Send form data as JSON in the request body
        })

        const result = await response.json() // Parse the JSON response

        if (result.success) {
          handleSuccess("Link created successfully") // Show success toast notification
          onSubmit(result.data) // Notify parent component with the new link data
          setFormData({
            destinationUrl: "",
            remarks: "",
            isExpirationEnabled: false,
            expirationDate: new Date(),
          }) // Reset form data after successful submission
          onClose() // Close the modal
        } else {
          handleError(result.message || "Failed to create link") // Show error if the API returns failure
        }
      } catch (error) {
        console.error("Error creating link:", error) // Log any unexpected errors
        handleError("Failed to create link") // Show error toast notification
      }
    } else {
      // If validation fails, show error messages
      if (newErrors.destinationUrl) {
        handleError("Please enter a valid URL.")
      }
    }
  }

  // Clear form data and reset errors
  const handleClear = () => {
    setFormData({
      destinationUrl: "",
      remarks: "",
      isExpirationEnabled: false,
      expirationDate: new Date(),
    })
    setErrors({ destinationUrl: false, remarks: false }) // Reset errors
  }

  return (
    <Dialog
      open={isOpen} // Open the modal when `isOpen` is true
      onClose={onClose} // Close the modal when the user clicks outside
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "8px", // Set rounded corners for the dialog box
          height: "90vh", // Set the dialog height to 90% of the viewport height
          margin: "20px", // Add margin around the dialog
        },
      }}
    >
      {/* Dialog Title with a close button */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#3B3C51", // Set background color for the title bar
          color: "white",
          fontSize: isSmallScreen ? "1.2rem" : "1.5rem", // Adjust font size for small screens
        }}
      >
        New Link
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon /> {/* Close icon */}
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        sx={{
          padding: isSmallScreen ? 2 : 3, // Adjust padding for small screens
          display: "flex",
          flexDirection: "column", // Stack form elements vertically
          flex: 1,
          overflow: "auto", // Allow scrolling if content overflows
        }}
      >
        {/* Form to input the link data */}
        <form className="space-y-6" style={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Destination Url" // Label for the URL input field
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleInputChange}
            placeholder="https://web.whatsapp.com/"
            required
            error={errors.destinationUrl} // Show error if URL is invalid
            helperText={errors.destinationUrl ? "Please enter a valid URL" : ""} // Display error message
            sx={{ mt: 2 }} // Margin top
          />

          <TextField
            fullWidth
            label="Remarks" // Label for the remarks input field
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Add remarks"
            required
            multiline
            rows={4} // Set the number of rows for multiline input
            error={errors.remarks} // Show error if remarks are empty
            helperText={errors.remarks ? "Remarks are required" : ""} // Display error message
            sx={{ mt: 3 }} // Margin top
          />

          {/* Expiration Date Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <span
              style={{
                color: "#343446",
                fontSize: isSmallScreen ? "1rem" : "1.1rem", // Adjust font size for small screens
              }}
            >
              Link Expiration
            </span>
            <Switch
              checked={formData.isExpirationEnabled}
              onChange={handleExpirationToggle} // Handle toggle change
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#1b48da", // Color when the switch is checked
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#1b48da", // Track color when checked
                },
              }}
            />
          </div>

          {/* DateTimePicker for expiration date, shown only if expiration is enabled */}
          {formData.isExpirationEnabled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={formData.expirationDate}
                onChange={handleDateChange} // Update the expiration date
                textField={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                components={{
                  OpenPickerIcon: CalendarTodayIcon, // Custom calendar icon
                }}
                minDateTime={new Date()} // Ensure the date is not in the past
              />
            </LocalizationProvider>
          )}
          <ToastContainer /> {/* Toast notifications for success/error */}
        </form>
      </DialogContent>

      {/* Bottom buttons */}
      <div
        style={{
          padding: "16px 24px",
          backgroundColor: "rgba(59, 60, 81, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Clear button */}
        <Button
          onClick={handleClear} // Reset form data when clicked
          sx={{
            color: "#6A6A6A",
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
        {/* Submit button */}
        <Button
          onClick={handleSubmit} // Handle form submission
          variant="contained"
          sx={{
            backgroundColor: "#1b48da", // Button color
            "&:hover": {
              backgroundColor: "#1539b3", // Hover effect
            },
            fontSize: "1.1rem",
            px: 4,
            textTransform: "none",
          }}
        >
          Create new
        </Button>
      </div>
    </Dialog>
  )
}

export default NewLinkModal
