import express from "express";
import {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
} from "../../controllers/student-controller/course-progress-controller.js";
const studentCourseProgressRoutes = express.Router();

studentCourseProgressRoutes.get("/get/:userId/:courseId", getCurrentCourseProgress);
studentCourseProgressRoutes.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
studentCourseProgressRoutes.post("/reset-progress", resetCurrentCourseProgress);
export default studentCourseProgressRoutes;