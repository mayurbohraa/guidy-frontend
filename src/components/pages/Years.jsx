import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCoursesApi } from "../../service/Courses.service";
import { createRegistrationApi } from "../../service/Registration.service";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Popup from "../Popup";

const Years = () => {
  const [FallCheck, setFallCheck] = useState();
  const [SpringCheck, setSpringCheck] = useState();
  const [selected, setSelected] = useState();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseID] = useState([]);
  const params = useParams();

  const history = useNavigate();

  useEffect(() => {
    console.log(params);
    fetchCourses();
  }, [params]);

  const fetchCourses = async () => {
    const courseResponse = await getCoursesApi();
    setCourses(courseResponse.data);
  };

  const handleFallCheck = (e) => {
    setFallCheck(e.target.checked);
    setSpringCheck(false);
    if (e.target.checked) {
      const courses = courseId;
      courses.push(e.target.value);
      setCourseID(courses);
      console.log(courses);
    }
  };

  const handleSpringCheck = (e) => {
    setSpringCheck(e.target.checked);
    setFallCheck(false);
    if (e.target.checked) {
      const courses = courseId;
      courses.push(e.target.value);
      setCourseID(courses);
      console.log(courses);
    }
  };

  const [isShown, setIsShown] = useState(false);

  const handleClick = (event) => {
    setIsShown(!isShown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        courseIds: courseId,
      };
      const response = await createRegistrationApi(body);
      // console.log(response.data);
      

      if(response.status === 400){
        toast.warning("You can only register more than 3 and less than equal to 6 subjects", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      }else{
        toast.success("Course Registration Successfull !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
        history("/userdashboard/myschedule");
      }

      
    } catch (err) {
      console.log(err);
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  };

  return (
    <div className="years">
      <form action="" onSubmit={handleSubmit}>
        <div className="year">
          <div className="container">
            <ul>
              <li>
                <h1>Select Fall Courses</h1>
              </li>
              {courses
                .filter(
                  (course) =>
                    String(course.year) === String(params.year) &&
                    course.term === "fall"
                )
                .map((course, index) => {
                  return (
                    <>
                      <li className="fall-courses">
                        <input
                          type="checkbox"
                          disabled={SpringCheck}
                          onChange={handleFallCheck}
                          name=""
                          id=""
                          value={course._id}
                        />{" "}
                        <span
                          onClick={() => {
                            handleClick();
                            setSelected(index);
                          }}
                        >
                          {course.name}
                        </span>
                        {isShown && (
                          <div
                            className={
                              selected === index ? "courseinfo" : "hide"
                            }
                          >
                            <Popup
                              content={<div>{course.course_info}</div>}
                              handleClose={handleClick}
                            />
                          </div>
                        )}
                      </li>
                    </>
                  );
                })}
            </ul>
          </div>
          <div className="container">
            <ul>
              <li>
                <h1>Select Spring Courses</h1>
              </li>
              {courses
                .filter(
                  (course) =>
                    String(course.year) === String(params.year) &&
                    course.term === "spring"
                )
                .map((course, index) => {
                  return (
                    <>
                      <li className="fall-courses">
                        <input
                          type="checkbox"
                          disabled={FallCheck}
                          onChange={handleSpringCheck}
                          name=""
                          id=""
                          value={course._id}
                        />{" "}
                        <span
                          onClick={() => {
                            handleClick();
                            setSelected(index);
                          }}
                        >
                          {course.name}
                        </span>
                        {isShown && (
                          <div
                            className={
                              selected === index ? "courseinfo" : "hide"
                            }
                          >
                            <Popup
                              content={<div>{course.course_info}</div>}
                              handleClose={handleClick}
                            />
                          </div>
                        )}
                      </li>
                    </>
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
