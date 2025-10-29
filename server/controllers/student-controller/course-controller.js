import Course from "../../models/Course.js";
import StudentCourses from "../../models/StudentCourses.js";

export const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;
    let fiters = {};

    if (category.length) {
      fiters.category = { $in: category.split(",") };
    }

    if (level.length) {
      fiters.level = { $in: level.split(",") };
    }

    if (primaryLanguage.length) {
      fiters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.pricing = 1;
        break;
      case "price-hightolow":
        sort.pricing = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.pricing = 1;
        break;
    }
    const coursesList = await Course.find(fiters).sort(sort);

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id} = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course Details Not Found!",
        data: null,
      });
    }


    res.status(200).json({
      success: true,
      data: courseDetails
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
 
export const checkCoursePurchaseInfo = async (req, res) => {
  try { 
    const { id, studentId } = req.params;
    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses?.courses?.findIndex((item) => item.courseId === id) > -1;
    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
