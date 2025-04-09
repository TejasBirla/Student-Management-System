import React from "react";

export default function Welcome() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Student Management System</h1>
      <p style={styles.description}>
        Effortlessly manage student records with our intuitive platform. Get
        started by creating an account or log in to access your data. Empower
        your student management experience! Seamlessly add, view, update, and
        remove student records with ease. Whether you're tracking progress or
        updating details, our platform streamlines the process — saving you
        time, reducing errors, and keeping everything organized in one place.
      </p>
    </div>
  );
}

// Inline styling
const styles = {
  container: {
    width: "80%",
    margin: "auto",
    textAlign: "center",
    padding: "50px",
  },
  heading: {
    color: "#2c3e50",
    marginBottom: "20px",
    fontSize: "32px",
  },
  description: {
    fontSize: "20px",
    color: "#555",
    marginBottom: "30px",
  },
};
