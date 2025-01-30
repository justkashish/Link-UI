import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";

function NewLinkModal({ isOpen, onClose, onSubmit }) {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`;
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remarks: "",
    isExpirationEnabled: false,
    expirationDate: new Date(),
  });
  const [errors, setErrors] = useState({
    destinationUrl: false,
    remarks: false,
  });
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const validateUrl = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$','i' // fragment locator
    );
    return !!pattern.test(str);
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
      destinationUrl: !validateUrl(formData.destinationUrl),
      remarks: !formData.remarks,
    };
    setErrors(newErrors);

    if (!newErrors.destinationUrl && !newErrors.remarks) {
      const data = {
        url: formData.destinationUrl,
        remark: formData.remarks,
        expirationDate: formData.isExpirationEnabled
          ? formData.expirationDate
          : null,
      };

      try {
        const response = await fetch(`${uri}/api/v1/link/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          handleSuccess("Link created successfully");
          onSubmit(result.data);
          console.log("Link created successfully");
          // Reset form data and close the modal
          setFormData({
            destinationUrl: "",
            remarks: "",
            isExpirationEnabled: false,
            expirationDate: new Date(),
          });
          onClose(); // Close modal
        } else {
          handleError(result.message || "Failed to create link");
        }
      } catch (error) {
        console.error("Error creating link:", error);
        handleError("Failed to create link");
      }
    }
    else {
      if (newErrors.destinationUrl) {
        handleError("Please enter a valid URL.");
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
          sx:  {
            // Adjust for laptops
            "@media (min-width: 1024px) and (max-width: 1440px)": {
              width: "700px", // A moderate size for laptops
              maxWidth: "700px",
            },
            // Adjust for smaller devices
            "@media (max-width: 768px)": {
              width: "100%", // Full width for mobile devices
              margin: "16px",
            },
          }, // Responsive width for small screens
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: isSmallScreen ? "1.2rem" : "1.5rem", // Adjust font size for small screens
        }}
      >
        New Link
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: isSmallScreen ? 2 : 3 }}>
      <ToastContainer />
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
            helperText={
              errors.destinationUrl ? "Please enter a valid URL" : ""
            }
            sx={{ mt: 2 }}
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
            
              flexDirection: isSmallScreen ? "column" : "row", // Stack buttons on small screens
              gap: isSmallScreen ? "16px" : "0",
            }}
          >
            <Button
              onClick={handleClear}
              sx={{
                color: "#6A6A6A",
                "&:hover": {
                  backgroundColor: "#3B3C511A",
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
       
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewLinkModal;
