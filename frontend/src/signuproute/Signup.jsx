import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!inputValue.username.trim())
      newErrors.username = "Username is required";
    if (!inputValue.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.email))
      newErrors.email = "Invalid email format";
    if (!inputValue.password.trim())
      newErrors.password = "Password is required";
    else if (inputValue.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValue),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setErrors({});
        localStorage.setItem("user-token", data.token);
        navigate("/allstudents");
      } else {
        setMessage("");
        setErrors((prev) => ({ ...prev, global: data.message }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <input
        type="text"
        placeholder="Enter username"
        name="username"
        value={inputValue.username}
        onChange={handleInput}
        autoComplete="off"
      />
      {errors.username && <p className="error">{errors.username}</p>}

      <input
        type="email"
        placeholder="Enter email address"
        name="email"
        value={inputValue.email}
        onChange={handleInput}
        autoComplete="off"
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        type="password"
        placeholder="Enter password"
        name="password"
        value={inputValue.password}
        onChange={handleInput}
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <button onClick={handleSubmit}>Continue</button>

      {message && <p className="success">{message}</p>}
      {errors.global && <p className="error">{errors.global}</p>}
      <p className="login-para">
        Already have an Account? Click here to{" "}
        <Link to="/login" className="login-text">
          Login
        </Link>
      </p>
    </div>
  );
}
