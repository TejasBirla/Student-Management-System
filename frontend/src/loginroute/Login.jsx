import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleInputValue = (event) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!inputValue.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!inputValue.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
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
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Enter email address"
        name="email"
        value={inputValue.email}
        onChange={handleInputValue}
        autoComplete="off"
      />
      {errors.email && <p className="error">{errors.email}</p>}
      <input
        type="password"
        placeholder="Enter password"
        name="password"
        value={inputValue.password}
        onChange={handleInputValue}
      />
      {errors.password && <p className="error">{errors.password}</p>}
      <button onClick={handleSubmit}>Continue</button>
      {message && <p className="success">{message}</p>}
      {errors.global && <p className="error">{errors.global}</p>}
      <p className="signup-para">
        New Here?{" "}
        <Link to="/signup" className="signup-text">
          Signup
        </Link>{" "}
        Now!
      </p>
    </div>
  );
}
