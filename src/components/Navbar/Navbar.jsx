import React from "react";
import { useState, useEffect } from "react";
import { useSearch } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaCloudSun, FaPlus } from "react-icons/fa";
import search from "../../assets/Frame (1).svg";
import "./Navbar.css";
import NewLinkModal from "../NewLinkModal/NewLinkModal";
import { handleSuccess, handleError } from "../../utils";
import cuvette from "../../assets/cuvette.png";

const Navbar = ({isMobileMenuOpen, setIsMobileMenuOpen}) => {
  const uri = `${import.meta.env.VITE_BACKEND_URL}`;
  const { updateSearchQuery } = useSearch(); // Get updateSearchQuery function from context
  const [query, setQuery] = useState(""); // Local state for search input
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const greetings =
    hours < 6
      ? " Good Late Night"
      : hours < 12
      ? " Good Morning"
      : hours < 18
      ? " Good Afternoon"
      : hours < 21
      ? " Good Evening"
      : " Good Night";
  const emoji =
    hours < 6 ? (
      <FaMoon />
    ) : hours < 12 ? (
      <FaSun color="yellow" />
    ) : hours < 18 ? (
      <FaCloudSun color="yellow" />
    ) : hours < 21 ? (
      <FaCloudSun color="orange" />
    ) : (
      <FaMoon />
    );

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = days[currentTime.getDay()];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = currentTime.getDate();
  const month = monthNames[currentTime.getMonth()];
  const currentDate = `${dayOfWeek}, ${month} ${day}`;
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        const response = await fetch(`${uri}/api/v1/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.success) {
          setLoggedInUser(capitalizeFirstLetter(result.data.name));
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);


  const handleNewLinkSubmit = (linkData) => {
    console.log("Received data from modal:", linkData);
    // Perform any action with the link data (e.g., send it to the backend)
  };

  const handleSearchIconClick = () => {
    updateSearchQuery(query); // Update the search query in context
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    console.log("User Logged out successfully");
    handleSuccess("User Logged out");
    setIsLogoutVisible(false);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="navbar">
      <div className="image">
        <img src={cuvette} className="cuvette" alt="Cuvette Logo" />
      </div>
      <div className="navbar-intro">
        <h2>
          {emoji} {greetings}, {loggedInUser}
        </h2>
        <p>{currentDate}</p>
      </div>
      <div className="navbar-right">
        <button className="create-button" onClick={() => setIsModalOpen(true)}>
          <FaPlus />
          Create new
        </button>
        <NewLinkModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewLinkSubmit}
        />
        <div className="search-bar">
          <img src={search} alt="search icon" onClick={handleSearchIconClick} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Remark"
          />
        </div>
        <div
          className="profile-pic"
          onClick={(e) => {
            e.stopPropagation(); // Prevents event conflicts
            if (window.innerWidth < 768) {
              console.log("Toggling mobile menu..."); // Debugging
              setIsMobileMenuOpen((prev) => !prev); // Toggle mobile menu
            } else {
              console.log("Toggling logout dropdown..."); // Debugging
              setIsLogoutVisible((prev) => !prev); // Toggle logout dropdown
            }
          }}
        >
          {loggedInUser.charAt(0).toUpperCase()}
          {loggedInUser.charAt(1).toUpperCase()}
          {/* Logout button - Show only on desktop */}
          {isLogoutVisible && window.innerWidth >= 768 && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
