import express from 'express';
import { getCoursesByStudentId } from '../../controllers/student-controller/student-courses-controller.js';
const studentCoursesRoutes = express.Router();

studentCoursesRoutes.get("/get/:studentId",getCoursesByStudentId);

export default studentCoursesRoutes;