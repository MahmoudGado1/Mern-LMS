import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
const MediaProgressbar = ({ isMediaUploading, progress }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(()=>{
    if(isMediaUploading){
      setShowProgress(true)
      setAnimatedProgress(progress)
    }else{
      const timer = setTimeout(()=>{
        setShowProgress(false)
      },1000)
      return ()=>clearTimeout(timer)
    }
  },[isMediaUploading,progress])

  if(!showProgress) return null
  return (
    <div className="w-full bg-gray-200 rounded-full h-[18px] mt-5 mb-5 relative overflow-hidden">
      <motion.div
        className="bg-blue-600 h-[18px] rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {progress >= 100 && isMediaUploading && (
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 bg-blue-400 opacity-50"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration:1,
              repeat:Infinity,
              ease:'linear'
            }}
          />
          
        )}
        <p className="absolute text-sm font-thin top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">uploading...</p>
      </motion.div>
    </div>
  );
};

export default MediaProgressbar;
