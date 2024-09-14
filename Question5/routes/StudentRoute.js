const express = require("express");
const Student = require("../models/Students.js");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Get all students
router.get("/", authMiddleware, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Create a student
router.post("/", authMiddleware, async (req, res) => {
  const { name, age, email, address } = req.body;

  try {
    const student = new Student({ name, age, email, address });
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a student
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, age, email, address } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, email, address },
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a student
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
