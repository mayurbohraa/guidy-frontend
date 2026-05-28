import React, { useEffect, useReducer, useState } from "react";
import Tasklistbox from "../pages/Tasklistbox";

import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

import ChartBar from "../pages/ChartBar";
import { getRegistrationApi } from "../../service/Registration.service";

import apiRoutes from "../../Api/apiRoutes";

import { guidyDelete, guidyGet, guidyPost } from "../../Api/api.service";
import { getEventsApi } from "../../service/Events.service";

import Popup2 from "../Popup2";
import { UilInfoCircle } from "@iconscout/react-unicons";

const initialState = {
  tasks: [],
  isLoading: false,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case "fetchingTasks":
      return {
        ...state,
        isLoading: true,
      };
    case "taskfetched":
      return {
        ...state,
        isLoading: false,
        tasks: action.payload,
      };
    case "createTask":
      return {
        ...state,
        isLoading: true,
      };
    case "taskCreated":
      return {
        ...state,
        isLoading: false,
        tasks: [state.tasks, action.payload],
      };
    case "updateTask":
      return {
        ...state,
        isLoading: true,
      };
    case "deleteTask":
      return {
        ...state,
      };
    case "getGrades":
      return {
        ...state,
        grades: action.payload,
      };
    default:
      return state;
  }
};

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const Dashboard = () => {
  return (
    <div className="usrdashboard">
      <div className="part1">
        {/* Schedule box  and performance chat*/}
        <ScheduleBox />
        {/* My tasks box */}
        <TaskBox />
      </div>

      <div className="part2">
        {/* Overall Progress box */}
        <OverAllProgress />

        {/* calender box */}

        <GuidyCalendar />
      </div>
    </div>
  );
};

function ScheduleBox() {
  const [regCourses, setRegCourses] = useState([]);
  const [selected, setSelected] = useState(0);
  const [grades, setGrades] = useState([0, 0, 0, 0, 0]);

  async function getGrades(courseId) {
    const grades = await guidyGet(apiRoutes.fetchGradesByCourseId(courseId));
    console.log([
      grades.data.quiz1,
      grades.data.quiz2,
      grades.data.midterm,
      grades.data.project,
      grades.data.final,
    ]);
    setGrades([
      grades.data.quiz1,
      grades.data.quiz2,
      grades.data.midterm,
      grades.data.project,
      grades.data.final,
    ]);
  }

  useEffect(() => {
    fetchCourses();
  }, [grades]);

  const fetchCourses = async () => {
    const courseResponse = await getRegistrationApi();
    setRegCourses(courseResponse.data.courseIds);
  };

  return (
    <div className="SCPbox">
      <div className="schedbox">
        <div className="sched">
          <span>Schedule</span>
          {regCourses.map((course, index) => {
            return (
              <div
                className={
                  selected === index ? "schedcourse active" : "schedcourse"
                }
                key={index}
                onClick={() => {
                  setSelected(index);
                  getGrades(course._id);
                }}
              >
                <span>{course.name}</span>
              </div>
            );
          })}
        </div>

        <div className="courseovr">
          <span>Course Overview</span>
          {regCourses.map((course, index) => {
            return (
              <div className="courseovrdetails" key={index}>
                <div className={selected === index ? "courseovrbox" : "hide"}>
                  {course.course_info}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="performancebarbox">
        <span>Performance bar</span>
        <ChartBar data={grades} />
      </div>
    </div>
  );
}

function TaskBox() {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    dispatch({ type: "fetchingTasks" });
    const tasks = await guidyGet(apiRoutes.fetchTasks);
    dispatch({ type: "taskfetched", payload: tasks.data });
  }

  async function deleteTask(id) {
    dispatch({ type: "deletingTask" });
    const deleteTask = await guidyDelete(apiRoutes.deleteTask(id));
    dispatch({ type: "taskDeleted", payload: deleteTask });
  }

  return (
    <div className="mytasksbox">
      <span>My Tasks</span>
      {state.isLoading ? (
        <p>Loading...</p>
      ) : (
        state.tasks && (
          <Tasklistbox tasks={state.tasks} deleteTask={deleteTask} />
        )
      )}
    </div>
  );
}

function OverAllProgress() {
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [progress, setProgress] = useState(0);
  const [isShown, setIsShown] = useState(false);

  const handleClick = (event) => {
    setIsShown(!isShown);
  };

  async function onShow() {
    const progress = await guidyPost(apiRoutes.getProgress, {
      year: year,
      sem: term,
    });
    console.log(progress);
    setProgress(progress.data.toFixed(2) ?? 0);
  }

  return (
    <div className="overallprogressbox" id="overallprogressbox">
      <span>
        Overall Progress &nbsp;&nbsp;
        <span
          onClick={() => {
            handleClick();
          }}
        >
          <UilInfoCircle />
        </span>
        {isShown && (
          <Popup2
            content={
              <div>
                <ul>
                  <li>
                    To check overall progress do not select anything, just click
                    on show button
                  </li>
                  <li>
                    To check year progress select only year, just click on
                    show button
                  </li>
                  <li>
                    To check semester progress select both year & term, and
                    then click on show button
                  </li>
                </ul>
              </div>
            }
            handleClose={handleClick}
          />
        )}
      </span>

      <div className="OPgrid">
        <div style={{ marginLeft: "4px" }} className="overallprogressboxform">
          <form action="">
            <table>
              <tr>
                <td style={{ fontWeight: "bold" }}>Year : </td>
                <td>
                  <select
                    name="year"
                    id="year"
                    required
                    onChange={(e) => {
                      setYear(e.target.value);
                    }}
                  >
                    <option value="select-year">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </td>
              </tr>
              <span>&nbsp;</span>
              <tr>
                <td style={{ fontWeight: "bold" }}>Term : </td>
                <td>
                  <select
                    name="term"
                    id="term"
                    onChange={(e) => setTerm(e.target.value)}
                    required
                  >
                    <option value="">Select Term</option>
                    <option value="fall">Fall</option>
                    <option value="spring">Spring</option>
                  </select>
                </td>
              </tr>
              <span>&nbsp;</span>
              <tr>
                <td></td>
                <td>
                  <button type="button" onClick={onShow}>
                    Show
                  </button>
                </td>
              </tr>
            </table>
          </form>
        </div>

        <div className="progressBar">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="float"
          >
            <path
              fill="rgba(217, 217, 217, 0.82)"
              d="M31.6,-52.4C43.1,-48.1,56,-44,62.7,-35.2C69.4,-26.5,69.9,-13.3,71.2,0.8C72.5,14.8,74.6,29.5,69.4,40.8C64.2,52.1,51.6,59.9,38.8,67.7C26,75.4,13,83.2,1.8,80C-9.4,76.9,-18.8,62.8,-32.4,55.6C-46.1,48.3,-64,47.8,-73.8,39.6C-83.6,31.5,-85.4,15.8,-79.8,3.2C-74.2,-9.3,-61.3,-18.6,-54.7,-32.4C-48.2,-46.3,-48.1,-64.7,-40,-71C-32,-77.3,-16,-71.4,-3,-66.3C10.1,-61.2,20.1,-56.7,31.6,-52.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="floating"
          >
            <path
              fill="rgba(194, 35, 39, 0.76)"
              d="M31.6,-52.4C43.1,-48.1,56,-44,62.7,-35.2C69.4,-26.5,69.9,-13.3,71.2,0.8C72.5,14.8,74.6,29.5,69.4,40.8C64.2,52.1,51.6,59.9,38.8,67.7C26,75.4,13,83.2,1.8,80C-9.4,76.9,-18.8,62.8,-32.4,55.6C-46.1,48.3,-64,47.8,-73.8,39.6C-83.6,31.5,-85.4,15.8,-79.8,3.2C-74.2,-9.3,-61.3,-18.6,-54.7,-32.4C-48.2,-46.3,-48.1,-64.7,-40,-71C-32,-77.3,-16,-71.4,-3,-66.3C10.1,-61.2,20.1,-56.7,31.6,-52.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <span className="dot">
            {" "}
            <p className="dot-text">
              {progress} % <br /> Progress
            </p>{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

function GuidyCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const eventsResponse = await getEventsApi();
    setEvents(eventsResponse.data);
  };

  function tileClassName({ date, view }) {
    if (events.length) {
      if (
        events.filter((event) =>
          sameDay(new Date(date), new Date(event.eventDate))
        ).length
      ) {
        return "active-day";
      }
    }
  }

  return (
    <div className="calenderbox">
      <span>Calender</span>
      <Calendar
        // defaultValue={date}
        className={"calendar"}
        // value={}
        selectRange={true}
        tileClassName={tileClassName}
      />
    </div>
  );
}
export default Dashboard;
