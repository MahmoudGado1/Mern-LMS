require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const authRoutes = require("../routes/auth-routes/index");
const mediaRoutes = require("../routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("../routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("../routes/student-routes/course-routes");
const studentViewOrderRoutes = require("../routes/student-routes/order-routes");
const studentCoursesRoutes = require("../routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("../routes/student-routes/course-progress-routes");
const swaggerOptions = require("../swaggerOptions");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// ✅ Connect MongoDB safely for serverless
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}
connectDB();

// routes
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/courses-progress", studentCourseProgressRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

// ✅ Export (don't listen here)
module.exports = app;
