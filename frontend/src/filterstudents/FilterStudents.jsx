import React, { useState } from "react";
import "./FilterStudents.css";

export default function FilterStudents() {
  const [course, setCourse] = useState("BCA");
  const [student, setStudent] = useState([]);
  const [showCount, setShowCount] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("user-token");

  const handleInput = (event) => {
    setCourse(event.target.value);
    setShowCount(false);
    setErrorMessage("");
    setStudent([]);
  };

  const fetchStudent = async () => {
    if (!course) {
      setErrorMessage("Enter the course name first!");
      return;
    }
    if (!token) {
      setErrorMessage("You must be logged in to use this feature!");
      return;
    }
    let response = await fetch("http://localhost:8080/filterstudents", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course }),
    });
    let data = await response.json();
    if (data.success) {
      setStudent(data.studentDetails);
      setErrorMessage("");
      setShowCount(true);
    } else {
      setErrorMessage("Cannot find student detail with specific course name!");
      setStudent([]);
      setShowCount(false);
    }
  };
  return (
    <>
      <h1 className="title">Filter Students by Course</h1>
      <div className="filter-container">
        <div className="input-box">
          <select value={course} onChange={handleInput}>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
            <option value="B.Com">B.Com</option>
          </select>
          <button onClick={fetchStudent} className="fetch-btn">
            Fetch Student
          </button>
        </div>
      </div>

      <div className="container">
        {errorMessage && <p className="error">{errorMessage}</p>}

        {showCount && (
          <p className="student-length">
            Total students enrolled in {course} is: {student.length}
          </p>
        )}

        {student.map((student) => (
          <div key={student._id} className="student-details">
            <p>
              <strong>Student ID:</strong> {student.studentID}
            </p>
            <p>
              <strong>Student Name:</strong> {student.name}
            </p>
            <p>
              <strong>Student Course:</strong> {student.course}
            </p>
            <p>
              <strong>Student Address:</strong> {student.address.street},{" "}
              {student.address.city}
            </p>
            <p>
              <strong>Student Hobbies:</strong> {student.hobbies.join(", ")}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}
