import React, { useState } from "react";
import "./AddStudents.css";

export default function AddStudents() {
  const token = localStorage.getItem("user-token");
  const [student, setStudent] = useState({
    name: "",
    course: "BCA",
    address: { street: "", city: "" },
    hobbies: [],
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "street" || name === "city") {
      // Update address object
      setStudent((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else if (name === "hobbies") {
      // Convert comma-separated hobbies into an array
      setStudent((prev) => ({
        ...prev,
        hobbies: value.split(",").map((hobby) => hobby.trim()), // Convert input to array
      }));
    } else {
      // Update other fields
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addStudents = async () => {
    if (!token) {
      setError("You must be logged in to add students' details!");
      return;
    }
    const response = await fetch("http://localhost:8080/addstudents", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <>
      <h1 className="title">Add Student Data</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <div className="box">
        <p>
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Enter student name"
          />
        </p>
        <p>
          <label>Student Course</label>
          <select name="course" value={student.course} onChange={handleChange}>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
            <option value="B.Com">B.Com</option>
          </select>
        </p>

        <p>
          <label>Student Address - Street</label>
          <input
            type="text"
            name="street"
            value={student.address.street}
            onChange={handleChange}
            placeholder="Enter street"
          />
        </p>

        <p>
          <label>Student Address - City</label>
          <input
            type="text"
            name="city"
            value={student.address.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </p>

        <p>
          <label>Student Hobbies</label>
          <input
            type="text"
            name="hobbies"
            value={student.hobbies.join(", ")}
            onChange={handleChange}
            placeholder="Enter hobbies (comma separated)"
          />
        </p>

        <button className="add-btn" onClick={addStudents}>
          Add Student
        </button>
      </div>
    </>
  );
}
