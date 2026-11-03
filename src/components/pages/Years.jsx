import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { getCoursesApi } from "../../service/Courses.service";
import { createRegistrationApi } from "../../service/Registration.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../Popup";
const Years = () => {
  const [selected, setSelected] = useState();
  const [courses, setCourses] = useState([]);
  const [courseStatus, setCourseStatus] = useState("loading");
  const [courseId, setCourseID] = useState([]);
  const params = useParams();
  const history = useNavigate();
  useEffect(() => {
    setCourseID([]);
    fetchCourses();
  }, [params.year]);
  const fetchCourses = async () => {
    setCourseStatus("loading");
    try {
      const courseResponse = await getCoursesApi();
      if (!Array.isArray(courseResponse.data)) throw new Error("Invalid course list");
      setCourses(courseResponse.data);
      setCourseStatus("ready");
    } catch {
      setCourseStatus("error");
    }
  };

  // Derive the active term from the selected IDs rather than keeping two flags in sync.
  const selectedTerm = courses.find(course => courseId.includes(course._id))?.term;
  const handleCourseCheck = event => {
    const {
      value,
      checked
    } = event.target;
    setCourseID(current => checked ? [...current, value] : current.filter(id => id !== value));
  };
  const [isShown, setIsShown] = useState(false);
  const handleClick = event => {
    setIsShown(!isShown);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!courseId.length) {
        toast.warn("Select courses before registering");
        return;
      }
      const body = {
        courseIds: courseId
      };
      const response = await createRegistrationApi(body);
      if (response.status === 400) {
        toast.warning("You can only register more than 3 and less than equal to 6 subjects", {
          position: "top-right",
          theme: "colored",
          toastId: 1
        });
      } else {
        toast.success("Course Registration Successfull !", {
          position: "top-right",
          theme: "colored",
          toastId: 1
        });
        history("/userdashboard/myschedule");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to register courses", {
        position: "top-right",
        theme: "colored",
        toastId: 1
      });
    }
  };
  return (
    <div className="years">
      {courseStatus === "loading" && <p role="status">Loading courses…</p>}
      {courseStatus === "error" && <div role="alert">Courses could not be loaded. <button type="button" onClick={fetchCourses}>Try again</button></div>}
      {courseStatus === "ready" && !courses.some((course) => String(course.year) === String(params.year)) &&
        <p>No courses are available for this year.</p>}
      <form
        action=""
        onSubmit={handleSubmit}
      >
        <p className="guidy-field-hint">Choose four to six courses from the same year and term to register.</p>
        <div className="year">
          <div className="container">
            <ul>
              <li>
                <h1>Select Fall Courses</h1>
              </li>
              {courseStatus === "ready" && !courses.some((course) => String(course.year) === String(params.year) && course.term === "fall") && <li>No fall courses are available.</li>}
            {courses.filter(course => String(course.year) === String(params.year) && course.term === "fall").map((course, index) => {
                return (
                  <React.Fragment key={course._id}>
                    <li className="fall-courses">
                      <input
                        type="checkbox"
                        disabled={selectedTerm === "spring"}
                        onChange={handleCourseCheck}
                        name=""
                        id=""
                        value={course._id}
                        checked={courseId.includes(course._id)}
                        aria-label={course.name}
                      />{" "}
                      <span onClick={() => {
                        handleClick();
                        setSelected(course._id);
                      }}>
                        {course.name}
                      </span>
                      {isShown && selected === course._id && <div className={selected === course._id ? "courseinfo" : "hide"}>
                        <Popup
                          content={<div>{course.course_info}</div>}
                          handleClose={handleClick}
                        />
                      </div>}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
          <div className="container">
            <ul>
              <li>
                <h1>Select Spring Courses</h1>
              </li>
              {courseStatus === "ready" && !courses.some((course) => String(course.year) === String(params.year) && course.term === "spring") && <li>No spring courses are available.</li>}
            {courses.filter(course => String(course.year) === String(params.year) && course.term === "spring").map((course, index) => {
                return (
                  <React.Fragment key={course._id}>
                    <li className="fall-courses">
                      <input
                        type="checkbox"
                        disabled={selectedTerm === "fall"}
                        onChange={handleCourseCheck}
                        name=""
                        id=""
                        value={course._id}
                        checked={courseId.includes(course._id)}
                        aria-label={course.name}
                      />{" "}
                      <span onClick={() => {
                        handleClick();
                        setSelected(course._id);
                      }}>
                        {course.name}
                      </span>
                      {isShown && selected === course._id && <div className={selected === course._id ? "courseinfo" : "hide"}>
                        <Popup
                          content={<div>{course.course_info}</div>}
                          handleClose={handleClick}
                        />
                      </div>}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
        <button type="submit">Register for selected course</button>
      </form>
    </div>
  );
};
export default Years;
