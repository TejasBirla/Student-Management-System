import React, { useEffect, useState } from "react";
import "./Allstudents.css";

export default function Allstudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("user-token");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view details!");
      return;
    }
    fetch("http://localhost:8080/students", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStudents(data.students);
          setError("");
        } else {
          setError(data.message);
          setStudents([]);
        }
      })
      .catch((error) =>
        setError("Error fetching students. Try again later", error)
      );
  }, [token]);

  return (
    <>
      <h1>All Students Data</h1>
      <div className="container">
        {error ? (
          <p className="error">{error}</p>
        ) : students.length === 0 ? (
          <p>No students found</p>
        ) : (
          students.map((student) => (
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
          ))
        )}
      </div>
    </>
  );
}
