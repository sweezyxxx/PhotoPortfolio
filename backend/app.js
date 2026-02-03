require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const connectDB = require("./config/db");
connectDB();


app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const albumRoutes = require("./routes/albumRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/albums", albumRoutes);

app.listen(5000, () => console.log("Server running"));
