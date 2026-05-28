import React, { useEffect, useState } from "react";
import {
  dropCourseApi,
  endSemesterApi,
  getRegistrationApi,
} from "../../service/Registration.service";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const MySchedule = () => {
  const Navigate = useNavigate();
  const [regCourses, setRegCourses] = useState([]);
  const [, setEndSem] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const courseResponse = await getRegistrationApi();
    setRegCourses(courseResponse.data.courseIds);
    console.log(courseResponse.data.courseIds);
  };

  const dropSemCourse = async (courseId) => {
    try {
      const dropCourseResponse = await dropCourseApi(courseId);
      fetchCourses();
      console.log(dropCourseResponse);
      toast.success("Course Droped !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    } catch (err) {
      console.log(err);
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  };

  const endSemester = async () => {
    try {
      const endSemResponse = await endSemesterApi();
      console.log(endSemResponse);
      setEndSem([]);
      toast.success("Semester Ended !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
      Navigate(0);
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
    <div className="myschedule">
      <span>My Schedule</span>
      <p id="subheading">Your Registered Courses</p>
      <table>
        <tr>
          <th>Sr.</th>
          <th>Course name</th>
          <th>Year</th>
          <th>Semister</th>
          <th>Action</th>
        </tr>

        {regCourses.map((course, index) => {
          return (
            <>
              <tr>
                <td>{index + 1}</td>
                <td>{course.name}</td>
                <td>{course.year}</td>
                <td>{course.term}</td>
                <td>
                  <button onClick={() => dropSemCourse(course._id)}>
                    Drop Course
                  </button>
                </td>
              </tr>
            </>
          );
        })}
      </table>

      <button id="semister" onClick={endSemester}>
        End Semister
      </button>
    </div>
  );
};

export default MySchedule;
