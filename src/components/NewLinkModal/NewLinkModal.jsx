import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Switch,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {toast} from 'react-toastify';

function NewLinkModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remarks: "",
    isExpirationEnabled: false,
    expirationDate: new Date(),
  });
  const [errors, setErrors] = useState({ destinationUrl: false, remarks: false });
  const token = localStorage.getItem("token"); // Get the token from localStorage

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        destinationUrl: "",
        remarks: "",
        isExpirationEnabled: false,
        expirationDate: new Date(),
      });
      setErrors({ destinationUrl: false, remarks: false });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExpirationToggle = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      isExpirationEnabled: e.target.checked,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prevState) => ({
      ...prevState,
      expirationDate: newDate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    const newErrors = {
      destinationUrl: !formData.destinationUrl,
      remarks: !formData.remarks,
    };
    setErrors(newErrors);

    if (!newErrors.destinationUrl && !newErrors.remarks) {
      const data = {
        url: formData.destinationUrl,
        remark: formData.remarks,
        expirationDate: formData.isExpirationEnabled ? formData.expirationDate : null,
      };

      try {
        // Send POST request to create new link
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/link/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token to header for authentication
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          toast.success("Link created successfully");
          onSubmit(result.data); // Call onSubmit to pass the data back to the parent component
          setFormData({
            destinationUrl: "",
            remarks: "",
            isExpirationEnabled: false,
            expirationDate: new Date(),
          }); // Reset form
          onClose(); // Close modal
        } else {
          toast.error(result.message || "Failed to create link");
        }
      } catch (error) {
        console.error("Error creating link:", error);
        toast.error("Failed to create link");
      }
    }
  };

  const handleClear = () => {
    setFormData({
      destinationUrl: "",
      remarks: "",
      isExpirationEnabled: false,
      expirationDate: new Date(),
    });
    setErrors({ destinationUrl: false, remarks: false });
  };

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
        New Link
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
            required
            error={errors.destinationUrl}
            helperText={errors.destinationUrl ? "Destination URL is required" : ""}
            sx={{ mt: 2 }}
            InputLabelProps={{
              required: true,
              style: { color: errors.destinationUrl ? "red" : "#343446" },
            }}
            InputProps={{
              style: { borderColor: errors.destinationUrl ? "red" : undefined },
            }}
          />

          <TextField
            fullWidth
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Add remarks"
            required
            multiline
            rows={4}
            error={errors.remarks}
            helperText={errors.remarks ? "Remarks are required" : ""}
            sx={{ mt: 3 }}
            InputLabelProps={{
              required: true,
              style: { color: errors.remarks ? "red" : "#343446" },
            }}
            InputProps={{
              style: { borderColor: errors.remarks ? "red" : undefined },
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
                textField={(params) => (
                  <TextField {...params} fullWidth sx={{ mt: 2 }} />
                )}
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
              }}
            >
              Create new
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewLinkModal;
