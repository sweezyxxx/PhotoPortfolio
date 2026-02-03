require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const connectDB = require("./config/db");
connectDB();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const albumRoutes = require("./routes/albumRoutes");
const userRoutes = require("./routes/userRoutes");
const multer = require("multer");

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

    next();
});

app.listen(5000, () => console.log("Server running"));
