import React, { useEffect, useReducer } from "react";
import { NavLink } from "react-router-dom";
import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";


const initialState = {
  isLoading:false,
  grades:[]
}

const gradesReducer = (state,action)=>{
  switch(action.type){
    case "fetchingGrades":
      return {
        ...state,
        isLoading:true,
      }
      case "gradesFetched":
        return {
          ...state,
          grades:action.payload
        }
    default:
      return initialState;
  }
}

const MyGrades = () => {
  const [state,dispatch] = useReducer(gradesReducer,initialState);

  useEffect(() => {
  }, []);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () =>{
    dispatch({type:"fetchingGrades"});
    const grades = await guidyGet(apiRoutes.fetchGrades);
    console.log(grades.data);
    dispatch({type:"gradesFetched",payload:grades.data});

  }

  function getAverageGrades(grade){
    return grade.quiz1 + grade.quiz2 + grade.midterm + grade.project + grade.final;
  }

  return (
    <div className="mygrades">
      <span>My Grades</span>

      <table>
        <tr>
          <th>Sr.</th>
          <th>Courses</th>
          <th>Grades</th>
        </tr>
        {
          state.grades.length===0?<p>There is no grades currenlty for you registered courses</p>:<div/>
        }
        {state.grades.map((grade, index) => {
          return (
            <>
              <tr>
                <td>{index + 1}</td>
                <td>
                  <NavLink to={`/userdashboard/grades/${grade.course._id}`} style={{color:"black"}}>{grade.course.name}</NavLink>
                </td>
                <td>{getAverageGrades(grade)}/100</td>
              </tr>
            </>
          );
        })}
      </table>
    </div>
  );
};

export default MyGrades;
