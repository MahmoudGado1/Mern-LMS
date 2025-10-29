import express from "express";
import {
  addNewCourse,
  getAllCourse,
  getCourseDetailsById,
  updateCourseById,
} from "../../controllers/instructor-controller/course-controller.js";
const instructorCourseRoutes = express.Router();
instructorCourseRoutes.post("/add", addNewCourse);

instructorCourseRoutes.get("/get", getAllCourse);

instructorCourseRoutes.get("/get/details/:id", getCourseDetailsById);
instructorCourseRoutes.put("/update/:id", updateCourseById);

export default instructorCourseRoutes;
