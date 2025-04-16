import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Welcome from "./Welcome";
import Signup from "./signuproute/Signup";
import Login from "./loginroute/Login";
import Allstudents from "./allstudents/Allstudents";
import AddStudents from "./addstudents/AddStudents";
import GetStudent from "./getStudent/GetStudent";
import UpdateStudents from "./updatestudents/UpdateStudents";
import FilterStudents from "./filterstudents/FilterStudents";
import Removestudents from "./removestudents/Removestudents";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/allstudents" element={<Allstudents />} />
        <Route path="/addstudents" element={<AddStudents />} />
        <Route path="/getstudent" element={<GetStudent />} />
        <Route path="/updatestudents" element={<UpdateStudents />} />
        <Route path="/filterstudents" element={<FilterStudents />} />
        <Route path="/removestudents" element={<Removestudents />} />
      </Routes>
    </BrowserRouter>
  );
}
