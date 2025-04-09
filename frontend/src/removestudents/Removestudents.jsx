import React, { useState } from "react";
import "./Removestudents.css";

export default function Removestudents() {
  const [studentID, setStudentID] = useState("");
  const [message, setMessage] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message
  const token = localStorage.getItem("user-token");

  const handleID = (event) => {
    setStudentID(event.target.value);
  };

  const deleteStudentData = async () => {
    setMessage(""); // Clear previous messages
    setError("");

    if (!studentID) {
      setError("Please enter a valid Student ID.");
      return;
    }

    if (!token) {
      setError("You must be logged in to remove student details!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/removestudents", {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID }), // Send as an object
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message); // Set success message
        setStudentID(""); // Clear input field
        setError("");
      } else {
        setError(data.message); // Set error message
      }
    } catch (error) {
      setError("Error deleting student. Please try again.");
    }
  };

  return (
    <>
      <h1 className="title">Remove Student Data</h1>
      <div className="remove-container">
        <label>Student ID:</label>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentID}
          onChange={handleID}
        />
        <button className="delete" onClick={deleteStudentData}>
          Delete Student Data
        </button>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </>
  );
}



