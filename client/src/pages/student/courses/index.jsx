import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import { Label } from "@radix-ui/react-label";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Helper to build query string
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

const StudentViewCoursesPage = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filter, setFilter] = useState({});
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate=useNavigate()
  const {auth}=useContext(AuthContext)
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  // Handle checkbox click
  function handleFilterOnChange(sectionId, option) {
    setFilter((prev) => {
      const current = prev[sectionId] || [];
      const updated = current.includes(option.id)
        ? current.filter((id) => id !== option.id)
        : [...current, option.id];

      const newFilter = { ...prev, [sectionId]: updated };

      if (updated.length === 0) {
        delete newFilter[sectionId]; // remove key if no values
      }

      sessionStorage.setItem("filters", JSON.stringify(newFilter));
      return newFilter;
    });
  }

  // Fetch course list
  const fetchAllStudentViewCourses = async (filter, sort) => {
    const query = new URLSearchParams({ ...filter, sortBy: sort });
    const response = await fetchStudentViewCourseListService(query);
    if (response.success) {
      setStudentViewCoursesList(response.data);
      setLoadingState(false);
    }
  };

  async function handleCourseNavigate(getCurrentCourseId){
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId,auth.user._id)
    if(response.success){
      if(response.data){
        navigate(`/course-progress/${getCurrentCourseId}`)
      }else{
        navigate(`/course/details/${getCurrentCourseId}`)
      }
    }
  }
  // Load filters on mount
  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setSort("price-lowtohigh");
    setFilter(storedFilters);
    setFiltersInitialized(true);
  }, []);

  // Fetch courses when filters/sort are ready
  useEffect(() => {
    if (filtersInitialized && filter !== null && sort !== null) {
      fetchAllStudentViewCourses(filter, sort);
    }
  }, [filter, sort, filtersInitialized]);

  // Update URL search params
  useEffect(() => {
    const queryString = createSearchParamsHelper(filter);
    setSearchParams(new URLSearchParams(queryString));
  }, [filter]);

  // Clear session storage on unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar filters */}
        <aside className="w-full md:w-64 space-y-4">
          <div>
            {Object.keys(filterOptions).map((keyItem, index) => (
              <div className="p-4 border-b" key={index}>
                <h3 className="font-bold">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((filterItem, idx) => (
                    <Label
                      key={idx}
                      className="flex items-center font-medium gap-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={
                          filter &&
                          Object.keys(filter).length > 0 &&
                          filter[keyItem] &&
                          filter[keyItem].indexOf(filterItem.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, filterItem)
                        }
                      />
                      {filterItem.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-3"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">
              {studentViewCoursesList?.length || 0} Results
            </span>
          </div>

          {/* Course list */}
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem, index) => (
                <Card onClick={()=>handleCourseNavigate(courseItem._id)} className="cursor-pointer" key={index}>
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem.image}
                        alt={courseItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By:{" "}
                        <span className="font-bold">
                          {courseItem.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] mt-3 text-gray-600 mb-2">
                        {`${courseItem.curriculum.length} ${
                          courseItem.curriculum.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">${courseItem.pricing}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="text-2xl font-bold text-center">
                No Courses Found
              </h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
