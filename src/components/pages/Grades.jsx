import React, { useCallback, useEffect, useState, useReducer } from "react";

import { UilGraphBar, UilInfoCircle } from "@iconscout/react-unicons";

import ChartBar from "./ChartBar";
// import { PCGrade } from "../../data/data3";
import Popup from "../Popup";

import apiRoutes from "../../Api/apiRoutes";
import { guidyGet } from "../../Api/api.service";
import { useParams } from "react-router-dom";

const initialState = {
  grade: {},
  isLoading: false,
  isDeleting: false,
};

const gradesReducer = (state, action) => {
  switch (action.type) {
    case "fetchingGrades":
      return {
        ...state,
        isLoading: true,
      };
    case "gradesfetched":
      return {
        ...state,
        isLoading: false,
        grade: action.payload,
      };
    default:
      return state;
  }
};

const Programmingconcepts = () => {
  const [isShown, setIsShown] = useState(false);
  const [isView, setIsView] = useState(false);
  const [state, dispatch] = useReducer(gradesReducer, initialState);
  const params = useParams();

  const fetchGrades = useCallback(async () => {
    dispatch({ type: "fetchingGrades" });
    const grades = await guidyGet(
      apiRoutes.fetchGradesByCourseId(params.courseId)
    );
    console.log(grades.data);
    dispatch({ type: "gradesfetched", payload: grades.data });
  }, [params.courseId]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const handleClick = (event) => {
    setIsShown(!isShown);
  };

  const handleClick2 = (event) => {
    setIsView(!isView);
  };

  return (
    <div className="grades">
      <span>My Grades</span>
      <p>{state.grade?.course?.name}</p>
      <table>
        <tr>
          <th>Sr.</th>
          <th>Task</th>
          <th>Grades</th>
        </tr>
        <tr>
          <td>{1}</td>
          <td>{"quiz1"}</td>
          <td>{state.grade.quiz1}/20</td>
        </tr>
        <tr>
          <td>{2}</td>
          <td>{"quiz2"}</td>
          <td>{state.grade.quiz2}/20</td>
        </tr>
        <tr>
          <td>{3}</td>
          <td>{"midterm"}</td>
          <td>{state.grade.midterm}/20</td>
        </tr>
        <tr>
          <td>{4}</td>
          <td>{"project"}</td>
          <td>{state.grade.project}/20</td>
        </tr>
        <tr>
          <td>{5}</td>
          <td>{"final"}</td>
          <td>{state.grade.final}/20</td>
        </tr>
      </table>

      <button onClick={handleClick} className="showchartbtn">
        Show Chart
        <span>
          <UilGraphBar />
        </span>
      </button>

      {isShown && (
        <Popup
          content={
            <div className="chartbar">
              <h2>Chart Bar</h2>
              <ChartBar
                data={[
                  state.grade.quiz1,
                  state.grade.quiz2,
                  state.grade.midterm,
                  state.grade.project,
                  state.grade.final,
                ]}
              />
            </div>
          }
          handleClose={handleClick}
        />
      )}

      <br />
      <button onClick={handleClick2} className="showchartbtn">
        Tips & Recommendations
        <span>
          <UilInfoCircle />
        </span>
      </button>

      {isView && (
        <Popup
          content={
            <div className="chartbar">
              <h2>Tips & Recommendations</h2>
              <p>
                If your average is less than 60 please refer to the resources
                uploaded and benefit from them for your sake. <br />
                If your average is greater than 60, <br /> <br />
                <b>You have passed ! You are performing well, keep it up. </b><br /><br />
                Please always check your performance bar for
                better analysis.
              </p>
            </div>
          }
          handleClose={handleClick2}
        />
      )}
    </div>
  );
};

export default Programmingconcepts;
