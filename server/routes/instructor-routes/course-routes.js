const express = require("express");
const {
  addNewCourse,
  getAllCourse,
  getCourseDetailsById,
  updateCourseById,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management for instructors
 */

/**
 * @swagger
 *  /instructor/course/add:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 */
router.post("/add", addNewCourse);

/**
 * @swagger
 *  /instructor/course/get:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get("/get", getAllCourse);

/**
 * @swagger
 *  /instructor/course/get/details/{id}:
 *   get:
 *     summary: Get course details by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get("/get/details/:id", getCourseDetailsById);

/**
 * @swagger
 *  /instructor/course/update/{id}:
 *   put:
 *     summary: Update course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.put("/update/:id", updateCourseById);

module.exports = router;
