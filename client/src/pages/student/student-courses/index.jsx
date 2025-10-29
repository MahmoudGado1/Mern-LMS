import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { VideoIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(
    StudentContext
  );
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth.user._id);
    if (response.success) {
      setStudentBoughtCoursesList(response.data);
    }
  }
  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course, index) => (
            <Card key={index} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    navigate(`/course-progress/${course?.courseId}`);
                  }}
                  className="flex-1"
                >
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex  justify-center h-[300px] col-span-full">
            <h1 className="text-3xl font-bold text-center">No Courses Found</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
