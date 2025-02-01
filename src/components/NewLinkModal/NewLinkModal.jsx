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
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function NewLinkModal({ isOpen, onClose, onSubmit }) {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remarks: "",
    isExpirationEnabled: false,
    expirationDate: new Date(),
  })
  const [errors, setErrors] = useState({
    destinationUrl: "",
    remarks: "",
  })
  const token = localStorage.getItem("token")
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        destinationUrl: "",
        remarks: "",
        isExpirationEnabled: false,
        expirationDate: new Date(),
      })
      setErrors({ destinationUrl: "", remarks: "" })
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateUrl = (url) => {
    if (!url) return "This field is mandatory"
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i",
    )
    return pattern.test(url) ? "" : "Please enter a valid URL"
  }

  const validateForm = () => {
    const urlError = validateUrl(formData.destinationUrl)
    const remarksError = !formData.remarks ? "This field is mandatory" : ""

    setErrors({
      destinationUrl: urlError,
      remarks: remarksError,
    })

    return !urlError && !remarksError
  }

  const handleExpirationToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      isExpirationEnabled: e.target.checked,
    }))
  }

  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      expirationDate: newDate,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch(`${uri}/api/v1/link/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formData.destinationUrl,
          remark: formData.remarks,
          expirationDate: formData.isExpirationEnabled ? formData.expirationDate : null,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success("Link created successfully", {
          position: "top-right",
          autoClose: 3000,
        })
        onSubmit(result.data)
        onClose()
      } else {
        toast.error(result.message || "Failed to create link", {
          position: "top-right",
          autoClose: 5000,
        })
      }
    } catch (error) {
      console.error("Error creating link:", error)
      toast.error("An error occurred while creating the link", {
        position: "top-right",
        autoClose: 5000,
      })
    }
  }

  const handleClear = () => {
    setFormData({
      destinationUrl: "",
      remarks: "",
      isExpirationEnabled: false,
      expirationDate: new Date(),
    })
    setErrors({ destinationUrl: "", remarks: "" })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "8px",
          height: "90vh",
          margin: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#3B3C51",
          color: "white",
          fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
        }}
      >
        New Link
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: isSmallScreen ? 2 : 3,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "auto",
        }}
      >
        <form className="space-y-6" style={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Destination Url"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleInputChange}
            placeholder="https://web.whatsapp.com/"
            error={!!errors.destinationUrl}
            helperText={errors.destinationUrl}
            FormHelperTextProps={{
              sx: {
                color: "#FF0000",
                marginLeft: 0,
                fontSize: "0.75rem",
              },
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Comments"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Add remarks"
            multiline
            rows={4}
            error={!!errors.remarks}
            helperText={errors.remarks}
            FormHelperTextProps={{
              sx: {
                color: "#FF0000",
                marginLeft: 0,
                fontSize: "0.75rem",
              },
            }}
            sx={{ mt: 3 }}
          />

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
                fontSize: isSmallScreen ? "1rem" : "1.1rem",
              }}
            >
              Link Expiration
            </span>
            <Switch
              checked={formData.isExpirationEnabled}
              onChange={handleExpirationToggle}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#1b48da",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#1b48da",
                },
              }}
            />
          </div>

          {formData.isExpirationEnabled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={formData.expirationDate}
                onChange={handleDateChange}
                textField={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                components={{
                  OpenPickerIcon: CalendarTodayIcon,
                }}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          )}
        </form>
      </DialogContent>

      <div
        style={{
          padding: "16px 24px",
          backgroundColor: "rgba(59, 60, 81, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Button
          onClick={handleClear}
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
        <Button
          onClick={handleSubmit}
          variant="contained"
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
          Create new
        </Button>
      </div>
      <ToastContainer />
    </Dialog>
  )
}

export default NewLinkModal

