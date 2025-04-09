import React, { useState } from "react";
import "./GetStudent.css";
export default function GetStudent() {
  const [studentData, setStudentData] = useState({});
  const [studentID, setID] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("user-token");

  const handleID = (event) => {
    setID(event.target.value);
    setError("");
  };

  const getStudentData = async () => {
    if (!token) {
      setError("You must be logged in to get student details!");
      return;
    }
    let response = await fetch("http://localhost:8080/getstudent", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentID }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage("Data fetched successfully!");
      setStudentData(data.student);
      setError("");
      setID("");
    } else {
      setError("Student Data not found!");
      setMessage("");
      setStudentData({});
    }
  };

  return (
    <>
      <h1 className="title">Get Student Data</h1>
      <div className="student-data">
        <label>Enter Student ID:</label>
        <input
          type="number"
          placeholder="Enter student ID"
          value={studentID}
          onChange={handleID}
        />
        <button className="get-btn" onClick={getStudentData}>
          Get Data
        </button>
      </div>

      <div className="display-data">
        {Object.keys(studentData).length === 0 ? (
          <p className="error">{error}</p>
        ) : (
          <div className="display-box">
            <label>Name:</label>
            <input type="text" value={studentData.name} readOnly />

            <label>Course:</label>
            <input type="text" value={studentData.course} readOnly />

            <label>Address:</label>
            <input
              type="text"
              value={`${studentData.address.street}, ${studentData.address.city}`}
              readOnly
            />

            <label>Hobbies:</label>
            <input
              type="text"
              value={studentData.hobbies ? studentData.hobbies.join(", ") : ""}
              readOnly
            />

            {message && <span className="success">{message}</span>}
          </div>
        )}
      </div>
    </>
  );
}
