import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import React, { useContext, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
const CourseCurriculum = () => {
  const {
    CourseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  const bulkUploadInputRef = useRef(null);
  const { toast } = useToast();
  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...CourseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    // console.log(cpyCourseCurriculumFormData)
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        // console.log(response)
        if (response.success) {
          let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // console.log(CourseCurriculumFormData)

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;
    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );
    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      toast({
        title: "Video Replaced Successfully",
        description: "You can now upload a new video",
      });
    }
  }
  function isCourseCurriculumFormDataValid() {
    return CourseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }
  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }
  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([ value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }
  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));
    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response.success) {
        let cpyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty(
          CourseCurriculumFormData
        )
          ? []
          : [...CourseCurriculumFormData];
        cpyCourseCurriculumFormData = [
          ...cpyCourseCurriculumFormData,
          ...response.data.map((item, index) => ({
            videoUrl: item.url,
            public_id: item.public_id,
            title: `Lecture ${cpyCourseCurriculumFormData.length + index + 1}`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    const getCurrentSelectedVideoPublicId=cpyCourseCurriculumFormData[currentIndex].public_id;
    const response=await mediaDeleteService(getCurrentSelectedVideoPublicId)
    if(response.success){
      cpyCourseCurriculumFormData=cpyCourseCurriculumFormData.filter((_,index)=>index!==currentIndex)
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      toast({
        title: response.message,
        description: "You can now add a new lecture",
      });
    }
  }
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            accept="video/*"
            ref={bulkUploadInputRef}
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            variant="outline"
            className="cursor-pointer"
            as="label"
            htmlFor="bulk-media-upload"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="mr-2 h-5 w-4" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
        <div className="mt-4 space-y-4">
          {CourseCurriculumFormData.map((curriculumItem, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  className="max-w-96"
                  name={`title-${index + 1}`}
                  placeholder="Enter Lecture Title"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={CourseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    id={`freePreview-${index + 1}`}
                    checked={CourseCurriculumFormData[index]?.freePreview}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {CourseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={CourseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <div className="flex flex-col justify-center gap-4">
                      <Button onClick={() => handleReplaceVideo(index)}>
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-900"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
