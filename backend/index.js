// Import required packages
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
require("dotenv").config(); // Load environment variables

const jwt = require("jsonwebtoken");
const { MongoClient, default: mongoose } = require("mongoose");

// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.TOKEN;
const PORT = process.env.PORT;

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error occur ", error));

// Define Student Schema
const StudentSchema = new mongoose.Schema({
  studentID: { type: Number, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
  },
  hobbies: { type: [String], required: true },
});
const Student = mongoose.model("Student", StudentSchema);

// Define User Schema for Authentication
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// Signup Route - Validates input and creates new user
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Input validations
    if (!username)
      return res.json({ success: false, message: "Username is required" });
    if (!email)
      return res.json({ success: false, message: "email is required" });
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return res.json({ success: false, message: "email is invalid" });
    if (!password)
      return res.json({ success: false, message: "Password is requried" });
    if (password.length < 6)
      return res.json({
        success: false,
        message: "Password must be at least 6 characters long!",
      });

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Save new user and return token
    const newUser = new User({ username, email, password });
    await newUser.save();
    const token = jwt.sign({ username, email }, JWT_SECRET);
    res.json({ success: true, message: "Signup successful!", token });
  } catch (error) {
    res.json({ success: false, message: "Error occur cant signup now!" });
  }
});

// Login Route - Validates user and issues JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email)
      return res.json({ success: false, message: "email is required" });
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return res.json({ success: false, message: "email is invalid" });
    if (!password)
      return res.json({ success: false, message: "Password is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Email ID not found" });

    const token = jwt.sign({ username: user.username, email }, JWT_SECRET);
    res.json({ success: true, message: "Login successful!", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Authentication Middleware - Protects routes
const AuthMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || token === "null" || token === "undefined") {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied! No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to next route handler
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid Token!" });
  }
};

// Fetch All Students - Protected
app.get("/students", AuthMiddleware, async (req, res) => {
  try {
    const allStudents = await Student.find();
    if (allStudents.length === 0) {
      return res.json({ success: false, message: "Students list not found" });
    }
    res.json({
      success: true,
      message: "Students list fetched successfully",
      students: allStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Add Student - Protected
app.post("/addstudents", AuthMiddleware, async (req, res) => {
  const { name, course, address, hobbies } = req.body;
  if (!name || !course || !address || !hobbies) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  try {
    // Auto-increment studentID
    const lastStudent = await Student.findOne().sort({ studentID: -1 });
    const newStudentID = lastStudent ? lastStudent.studentID + 1 : 1;

    const newStudent = new Student({
      studentID: newStudentID,
      name,
      course,
      address,
      hobbies,
    });

    await newStudent.save();
    res.json({
      success: true,
      message: "Student added successfully",
      studentDetail: newStudent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding student", error });
  }
});

// Get Single Student by studentID - Protected
app.post("/getstudent", AuthMiddleware, async (req, res) => {
  const { studentID } = req.body;
  if (!studentID) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required!" });
  }

  try {
    const student = await Student.findOne({ studentID });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching student", error });
  }
});

// Update Student - Protected
app.patch("/updatestudent", AuthMiddleware, async (req, res) => {
  const { studentID, ...updatedFields } = req.body;
  if (!studentID) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required!" });
  }

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentID },
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating student", error });
  }
});

app.post("/filterstudents", AuthMiddleware, async (req, res) => {
  const { course } = req.body;

  // Check if filterBy and course are provided
  if (!course) {
    return res
      .status(400)
      .json({ success: false, message: "Course is required for filtering" });
  }
  const trimmedCourse = course.trim();
  try {
    // Fetch students based on the course
    const studentDetails = await Student.find({
      course: { $regex: new RegExp(trimmedCourse, "i") },
    });

    // If no students found
    if (studentDetails.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No students found for this course" });
    }

    // Return the student details
    return res.json({ success: true, studentDetails });

  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching students",
    });
  }
});

// Delete Student by studentID - Protected
app.delete("/removestudents", AuthMiddleware, async (req, res) => {
  const studentID = Number(req.body.studentID);
  try {
    const fetchStudent = await Student.findOne({ studentID });
    if (!fetchStudent) {
      return res.json({ success: false, message: "Cannot find student" });
    }

    await Student.findOneAndDelete({ studentID });
    res.json({ success: true, message: "Student Data deleted" });
  } catch (error) {
    console.log("Error", error);
    res.json({ success: false, message: "Error deleting student", error });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
