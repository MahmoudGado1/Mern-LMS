import express from "express";
import multer from "multer";
import { deleteMediaFromCloudinary, uploadMediaToCloudinary } from "../../helpers/cloudinary.js";

const mediaRoutes = express.Router();

const upload = multer({ dest: "uploads/" });

mediaRoutes.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error Uploading File",
    });
  }
});

mediaRoutes.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assets Id is required",
      });
    }
    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "File Deleted Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error Deleting File",
    });
  }
});

mediaRoutes.post("/bulk-upload",upload.array("files",10),async(req,res)=>{
  try {
    const uploadPromises = req.files.map(fileItem=>uploadMediaToCloudinary(fileItem.path))
    const results = await Promise.all(uploadPromises)
    res.status(200).json({
      success: true,
      data: results,
    });
  }catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error in bulk uploading files",
    });
  } 
})

export default mediaRoutes;