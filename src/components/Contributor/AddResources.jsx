import { useReducer, useRef } from "react";
import { guidyGet, guidyPut } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const intialState = {
  year: "select-year",
  term: "select-term",
  subject: "select-subject",
  subjects: [],
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
    default:
      return state;
  }
};

const AddResources = ({ files, setFiles, removeFile }) => {
  const [state, dispatch] = useReducer(resourcesReducer, intialState);
  const fileInput = useRef();

  async function fetchSubjects(term) {
    dispatch({ type: "setTerm", payload: term });
    const subjects = await guidyGet(apiRoutes.getSubjects(term, state.year));
    dispatch({ type: "setSubjects", payload: subjects.data });
  }

  const uploadHandler = async (event) => {
    try {
      event.preventDefault();
      const file = fileInput.current.files[0];
      console.log(file);
      if (!file) return;
      file.isUploading = true;
      // setFiles([ file])
      console.log(file.name);

      // upload file
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("term", state.term);
      formData.append("year", state.year);
      formData.append("subject", state.subject);
      console.log(formData);
      const response = await guidyPut(apiRoutes.uploadResource, formData, 
      //{
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // }
      );
      console.log(response);
      dispatch({ type: "setYear", payload: "select-year" });
      dispatch({ type: "setTerm", payload: "select-term" });
      dispatch({ type: "setSubject", payload: "select-subject" });
      toast.success("Resorurce Added !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  };

  return (
    <div className="addresources">
      <span>Add Resources</span>

      <form onSubmit={uploadHandler}>
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
            <td>Upload file from device : </td>
            <td>
              <input
                type="file"
                className="custom-file-input"
                name="file"
                id="file"
                style={{ color: "transparent" }}
                required
                ref={fileInput}
                // onChange={uploadHandler}
                disabled={state.subject === "select-subject" ? true : false}
              />
            </td>
          </tr>

          <tr>
            <td></td>
            <td>
              <button type="submit">Submit Resource</button>
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
};

export default AddResources;
