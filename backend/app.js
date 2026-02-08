require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

const connectDB = require("./config/db");
connectDB();

// Allow all origins for Replit deployment
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const albumRoutes = require("./routes/albumRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/users", userRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve index.html for all non-API routes
app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(__dirname, "../frontend", "index.html"));
    }
});

// Multer-specific error handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next(err);
});

// Global error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});