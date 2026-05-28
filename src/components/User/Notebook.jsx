import React from "react";
import { useReducer } from "react";
import { guidyGet, guidyPost } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const intialState = {
  year: "select-year",
  term: "select-term",
  subject: "select-subject",
  subjects: [],
  notebookTitle: "notebookTitle",
  notebookContent: "notebookContent",
};

const resourcesReducer = (state, action) => {
  switch (action.type) {
    case "setYear":
      return {
        ...state,
        year: action.payload,
      };
    case "setTerm":
      return {
        ...state,
        term: action.payload,
      };
    case "setSubject":
      return {
        ...state,
        subject: action.payload,
      };
    case "setSubjects":
      return {
        ...state,
        subjects: action.payload,
      };
    case "setNotebookTitle":
      return {
        ...state,
        notebookTitle: action.payload,
      };
    case "setNotebookContent":
      return {
        ...state,
        notebookContent: action.payload,
      };
    default:
      return state;
  }
};

const Notebook = () => {
  const [state, dispatch] = useReducer(resourcesReducer, intialState);
  const navigate = useNavigate();

  async function fetchSubjects(term) {
    dispatch({ type: "setTerm", payload: term });
    const subjects = await guidyGet(apiRoutes.getSubjects(term, state.year));
    dispatch({ type: "setSubjects", payload: subjects.data });
  }

  const NotebookHandler = async (event) => {
    try {
      event.preventDefault();
      // upload file
      const formData = new FormData();
      formData.append("term", state.term);
      formData.append("year", state.year);
      formData.append("subject", state.subject);
      formData.append("notebookTitle", state.notebookTitle);
      formData.append("notebookContent", state.notebookContent);

      const response = await guidyPost(apiRoutes.addnotebook, formData);
      console.log(response);
      dispatch({ type: "setYear", payload: "select-year" });
      dispatch({ type: "setTerm", payload: "select-term" });
      dispatch({ type: "setSubject", payload: "select-subject" });
      dispatch({ type: "setNotebookTitle", payload: "notebookTitle" });
      dispatch({ type: "setNotebookContent", payload: "notebookContent" });

      toast.success("Notebook Added !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
      navigate("/userdashboard/notes/")
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  };

  return (
    <div className="notebook">
      <span>Notebook</span>

      <form onSubmit={NotebookHandler}>
        <table>
          <tr>
            <td>Year : </td>
            <td>
              <select
                name="year"
                id="year"
                required
                onChange={(e) => {
                  dispatch({ type: "setYear", payload: e.target.value });
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
          <tr>
            <td>Term : </td>
            <td>
              <select
                name="term"
                id="term"
                onChange={(e) => fetchSubjects(e.target.value)}
                disabled={state.year === "select-year" ? true : false}
                required
              >
                <option value="">Select Term</option>
                <option value="fall">Fall</option>
                <option value="spring">Spring</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Subject : </td>
            <td>
              <select
                name="subject"
                id="subject"
                onChange={(e) =>
                  dispatch({ type: "setSubject", payload: e.target.value })
                }
                disabled={state.term === "select-term" ? true : false}
                required
              >
                <option value="">Select Subject</option>
                {state.subjects.map((sub) => {
                  return <option value={sub._id}>{sub.name}</option>;
                })}
              </select>
            </td>
          </tr>
          <tr>
            <td>Notebook Title:</td>
            <td>
              <input
                type="text"
                className="note_title"
                name="note_title"
                id="note_title"
                placeholder="Notebook Title"
                onChange={(e) =>
                  dispatch({ type: "setNotebookTitle", payload: e.target.value })
                }
                required
                disabled={state.subject === "select-subject" ? true : false}
              />
            </td>
          </tr>
          <tr>
            <td>Notebook Content:</td>
            <td>
              <textarea
                className="notearea"
                name="note"
                id="note"
                cols="30"
                rows="3"
                // maxLength={50}
                required
                onChange={(e) =>
                  dispatch({ type: "setNotebookContent", payload: e.target.value })
                }
                placeholder="Notebook Content"
                disabled={state.subject === "select-subject" ? true : false}
              ></textarea>
            </td>
          </tr>

          <tr>
            <td style={{fontSize:"16px"}}>
              <NavLink className="note" to={"/userdashboard/notes/"}>
              View Notebooks
              </NavLink>
            </td>
            <td>
              <button type="submit">Submit Notebook</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
};

export default Notebook;
