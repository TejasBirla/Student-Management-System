import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const token = localStorage.getItem("user-token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user-token");
    navigate("/");
  };

  return (
    <>
      <ul>
        <li>
          <Link to="/allstudents">All Students</Link>
        </li>
        <li>
          <Link to="/addstudents">Add Students</Link>
        </li>
        <li>
          <Link to="/getstudent">Get Student</Link>
        </li>
        <li>
          <Link to="/updatestudents">Update Students</Link>
        </li>
        <li>
          <Link to="/removestudents">Remove Students</Link>
        </li>
        {token ? (
          <li onClick={logout} className="nav-btn-logout">
            Logout
          </li>
        ) : (
          <li>
            <Link to="/signup" className="nav-btn">
              Login
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}
