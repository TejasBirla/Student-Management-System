import React, { useState } from "react";
import "./UpdateStudents.css";

export default function UpdateStudents() {
  const [studentID, setStudentID] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("user-token");

  // Fetch student details when studentID is entered
  const fetchStudent = async () => {
    if (!studentID) {
      setError("Enter student ID");
      return;
    }

    if (!token) {
      setError("You must be logged in to update student details!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/getstudent`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID }),
      });

      const data = await response.json();
      if (data.success) {
        setStudent(data.student);
        setMessage("");
        setError("");
      } else {
        setError("Student data not found");
        setStudent(null);
        setMessage("");
        setStudentID("");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Update student details in the database
  const updateStudent = async () => {
    if (!student) return alert("No student selected");

    try {
      const response = await fetch("http://localhost:8080/updatestudent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <>
      <h1>Update Student Data</h1>
      <div className="update-container">
        <div className="input-group">
          <input
            type="number"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            placeholder="Enter student ID"
          />
          <button onClick={fetchStudent} className="fetch-btn">
            Fetch Student
          </button>
        </div>

        {error ? (
          <span className="error">{error}</span>
        ) : (
          <span className="success"> {message}</span>
        )}

        {student && (
          <div className="form-container">
            <p>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
              />
            </p>

            <p>
              <label>Course:</label>
              <select
                name="course"
                value={student.course}
                onChange={handleChange}
              >
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
              <label>Address - Street:</label>
              <input
                type="text"
                name="street"
                value={student.address.street}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
              />
            </p>

            <p>
              <label>Address - City:</label>
              <input
                type="text"
                name="city"
                value={student.address.city}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
              />
            </p>

            <p>
              <label>Hobbies:</label>
              <input
                type="text"
                name="hobbies"
                value={student.hobbies.join(", ")}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    hobbies: e.target.value
                      .split(",")
                      .map((hobby) => hobby.trim()),
                  }))
                }
              />
            </p>

            <button onClick={updateStudent} className="update-btn">
              Update Student
            </button>
          </div>
        )}
      </div>
    </>
  );
}
