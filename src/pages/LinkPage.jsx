import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LinkPage = () => {
  const { id } = useParams(); // Get the shortened URL ID from the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const uri = `${import.meta.env.VITE_BACKEND_URL}`;

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        console.log(`Fetching original URL for id: ${id}`);
        const response = await fetch(`${uri}/link/getUrl?id=${id}`); // Request to backend
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Received data:`, data);

        if (data.success) {
          console.log(`Redirecting to original URL: ${data.url}`);
          // Redirect to the original URL
          window.location.href = data.url;
        } else {
          setError("Link not found or has expired.");
        }
      } catch (err) {
        setError("An error occurred while fetching the link.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [id]); // Trigger this effect when the component mounts or the 'id' changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null; // Return nothing while waiting for the redirect
};

export default LinkPage;