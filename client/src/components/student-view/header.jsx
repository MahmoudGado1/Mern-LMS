import { GraduationCap, TvMinimalPlay, Menu } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

const StudentViewCommonHeader = () => {
  const { resetCredentials } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  return (
  <header className="p-4 border-b relative">
    <div className="flex items-center justify-between">
      {/* Left Side - Logo + Explore Courses */}
      <div className="flex items-center space-x-4">
        <Link
          to="/home"
          className="flex items-center space-x-2 hover:text-black"
        >
          <GraduationCap className="h-8 w-8" />
          <span className="font-extrabold md:text-xl text-[14px]">
            LMS LEARN
          </span>
        </Link>
        <Button
          onClick={() =>
            location.pathname.includes("/courses") ? null : navigate("/courses")
          }
          variant="ghost"
          className="text-[14px] md:text-[16px] font-medium hidden md:inline-flex"
        >
          Explore Courses
        </Button>
      </div>

      {/* Right Side - Hamburger Menu */}
      <div className="md:hidden">
        <Menu className="h-8 w-8 cursor-pointer" onClick={toggleMenu} />
      </div>

      {/* Desktop Navigation (Right side) */}
      <div className="hidden md:flex items-center space-x-4">
        <div
          onClick={() => navigate("/student-courses")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <span className="font-extrabold md:text-xl text-[14px] ">
            My Courses
          </span>
          <TvMinimalPlay className="h-8 w-8" />
        </div>
        <Button onClick={handleLogout}>Sign Out</Button>
      </div>
    </div>

    {/* Mobile Menu */}
    {menuOpen && (
      <div className="mt-4 flex flex-col space-y-3 md:hidden">
        <Button
          onClick={() => {
            if (!location.pathname.includes("/courses")) navigate("/courses");
            setMenuOpen(false);
          }}
          variant="ghost"
          className="w-full justify-start"
        >
          Explore Courses
        </Button>
        <Button
          onClick={() => {
            navigate("/student-courses");
            setMenuOpen(false);
          }}
          variant="ghost"
          className="w-full justify-start"
        >
          My Courses
        </Button>
        <Button onClick={handleLogout} className="w-full justify-start">
          Sign Out
        </Button>
      </div>
    )}
  </header>
);

};

export default StudentViewCommonHeader;
