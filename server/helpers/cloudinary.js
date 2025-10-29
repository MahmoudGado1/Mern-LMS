import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

export const uploadMediaToCloudinary=async(filePath)=>{
  try {
    const result=await cloudinary.uploader.upload(filePath,{
      resource_type:'auto'
    })
    return result
  } catch (error) {
    console.log(error)
    throw new Error('error uploading to cloudinary')
  }
}

export const deleteMediaFromCloudinary = async(publicId)=>{
  try {
    await cloudinary.uploader.destroy(publicId)
    
  } catch (error) {
    console.log(error)
    throw new Error('error deleting from cloudinary')
  }

}

