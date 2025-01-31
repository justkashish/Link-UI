import React, { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Switch, Button } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { ToastContainer } from "react-toastify"
import { handleError, handleSuccess } from "../../utils"

function EditLinkModal({ isOpen, onClose, onSubmit, linkDetails }) {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remarks: "",
    isExpirationEnabled: false,
    expirationDate: new Date(),
  })
  const [errors, setErrors] = useState({ destinationUrl: false, remarks: false })
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && linkDetails) {
      setFormData({
        destinationUrl: linkDetails.originalLink || "",
        remarks: linkDetails.remarks || "",
        isExpirationEnabled: !!linkDetails.expirationDate,
        expirationDate: linkDetails.expirationDate
          ? new Date(linkDetails.expirationDate)
          : new Date(),
      });
    }
  }, [isOpen, linkDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleExpirationToggle = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      isExpirationEnabled: e.target.checked,
    }))
  }

  const handleDateChange = (newDate) => {
    setFormData((prevState) => ({
      ...prevState,
      expirationDate: newDate,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {
      destinationUrl: !formData.destinationUrl,
      remarks: !formData.remarks,
    }
    setErrors(newErrors);

    if (!newErrors.destinationUrl && !newErrors.remarks) {
      const updatedData = {
        id: linkDetails?.id, // Ensure ID is passed for reference
        url: formData.destinationUrl,
        remark: formData.remarks,
        expirationDate: formData.isExpirationEnabled ? formData.expirationDate : null,
      };

      try {
        const response = await fetch(`${uri}/api/v1/link/edit/${linkDetails?.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        })

        const result = await response.json()

        if (result.success) {
          handleSuccess("Link updated successfully")
          onSubmit(result.data)
          onClose()
        } else {
          handleError(result.message || "Failed to update link")
        }
      } catch (error) {
        console.error("Error updating link:", error)
        handleError("Failed to update link")
      }
    }
  }

  const handleClear = () => {
    setFormData({
      destinationUrl: linkDetails?.originalLink || "",
      remarks: linkDetails?.remarks || "",
      isExpirationEnabled: !!linkDetails?.expirationDate,
      expirationDate: linkDetails?.expirationDate ? new Date(linkDetails.expirationDate) : new Date(),
    });
    setErrors({ destinationUrl: false, remarks: false })
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

      <DialogContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <DatePicker
                value={formData.expirationDate}
                onChange={handleDateChange}
                textField={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                components={{
                  OpenPickerIcon: CalendarTodayIcon,
                }}
                minDate={new Date()}
              />
            </LocalizationProvider>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
            }}
          >
            <Button
              onClick={handleClear}
              sx={{
                color: "#6a6a6a",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  color: "#343446",
                },
                fontSize: "1.1rem",
                textTransform:"none"
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1b48da",
                "&:hover": {
                  backgroundColor: "#1539b3",
                },
                fontSize: "1.1rem",
                px: 4,
                textTransform:"none"
              }}
            >
              Save
            </Button>
          </div>
          <ToastContainer />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditLinkModal

