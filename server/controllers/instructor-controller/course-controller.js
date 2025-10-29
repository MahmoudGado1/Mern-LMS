import Course from "../../models/Course.js";
export const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const savedCourse = await newlyCreatedCourse.save();

    if (savedCourse) {
      res.status(201).json({
        success: true,
        message: "Course Created Successfully",
        data: savedCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const coursesList=await Course.find({})
    res.status(200).json({
      success: true,
      data:coursesList
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};
export const getCourseDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      res.status(404).json({
        success: false,
        message: "Course Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};
export const updateCourseById = async (req, res) => {
  try {
    const {id}=req.params;
    const updatedCourseData=req.body;
    const updatedCourse = await Course.findByIdAndUpdate(id,updatedCourseData,{
      new:true
    })
    if(!updatedCourse){
      return res.status(404).json({
        success:false,
        message:"Course Not Found!"
      })
    }

    res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

