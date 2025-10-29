import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";

const CourseLanding = () => {
  const {CourseLandingFormData, setCourseLandingFormData} = useContext(InstructorContext);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <FormControls
          formData={CourseLandingFormData}
          setFormData={setCourseLandingFormData}
          formControls={courseLandingPageFormControls}
        />
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
