const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// API kiểm tra Backend
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend MERN đang hoạt động!"
    });
});

// API lấy danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy danh sách sinh viên",
            error: error.message
        });
    }
});

// API thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const { studentId, name, email } = req.body;

        const student = new Student({
            studentId,
            name,
            email
        });

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi thêm sinh viên",
            error: error.message
        });
    }
});

// API cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, name, email } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                studentId,
                name,
                email
            },
            {
                new: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi cập nhật sinh viên",
            error: error.message
        });
    }
});
// API xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student: deletedStudent
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xóa sinh viên",
            error: error.message
        });
    }
});
// Kết nối MongoDB Atlas
mongoose
    .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
    })
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Backend Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
