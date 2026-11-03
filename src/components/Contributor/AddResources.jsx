import FieldHelp from "../FieldHelp";
import { useReducer, useRef, useState } from "react";

import { guidyGet, guidyPut } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Panel, Workspace } from "../Workspace";
import "react-toastify/dist/ReactToastify.css";
const intialState = {
  year: "select-year",
  term: "select-term",
  subject: "select-subject",
  subjects: []
};
const resourcesReducer = (state, action) => {
  switch (action.type) {
    case "setYear":
      return {
        ...state,
        year: action.payload,
        term: "select-term",
        subject: "select-subject",
        subjects: []
      };
    case "setTerm":
      return {
        ...state,
        term: action.payload,
        subject: "select-subject",
        subjects: []
      };
    case "setSubject":
      return {
        ...state,
        subject: action.payload
      };
    case "setSubjects":
      return {
        ...state,
        subjects: action.payload
      };
    default:
      return state;
  }
};
const AddResources = () => {
  const [state, dispatch] = useReducer(resourcesReducer, intialState);
  const fileInput = useRef();
  const subjectRequest = useRef(0);
  const [subjectStatus, setSubjectStatus] = useState("idle");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function fetchSubjects(term) {
    dispatch({
      type: "setTerm",
      payload: term
    });
    const requestId = ++subjectRequest.current;
    if (term === "select-term") {
      setSubjectStatus("idle");
      return;
    }
    setSubjectStatus("loading");
    try {
      const subjects = await guidyGet(apiRoutes.getSubjects(term, state.year));
      if (requestId !== subjectRequest.current) return;
      if (!Array.isArray(subjects.data)) throw new Error("Invalid subject list");
      setSubjectStatus("ready");
      dispatch({
        type: "setSubjects",
        payload: subjects.data
      });
    } catch {
      if (requestId === subjectRequest.current) setSubjectStatus("error");
    }
  }
  async function uploadHandler(event) {
    event.preventDefault();
    if (uploadStatus === "loading") return;
    setUploadStatus("idle");
    setMessage("");
    const file = fileInput.current.files[0];
    if (state.subject === "select-subject" || !file || file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setMessage("Choose a subject and a file no larger than 10 MB.");
      return;
    }
    setUploadStatus("loading");
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("term", state.term);
      formData.append("year", state.year);
      formData.append("subject", state.subject);
      await guidyPut(apiRoutes.uploadResource, formData);
      dispatch({
        type: "setYear",
        payload: "select-year"
      });
      dispatch({
        type: "setTerm",
        payload: "select-term"
      });
      dispatch({
        type: "setSubject",
        payload: "select-subject"
      });
      fileInput.current.value = "";
      setSubjectStatus("idle");
      setUploadStatus("ready");
      setMessage("Resource submitted for review.");
    } catch (error) {
      setUploadStatus("error");
      setMessage(error.response?.status === 400 || error.response?.status === 413
        ? "Check the selected subject, file type, and file size."
        : "Unable to upload the resource. Try again.");
    }
  }
  return (
    <Workspace title="Add resources" description="Submit learning materials for administrator review.">
      <Panel title="New submission" wide>
        <div className="addresources workspace-upload">

          <form onSubmit={uploadHandler} aria-busy={uploadStatus === "loading"}>
            <p className="guidy-field-hint">Choose year 1–4, Fall or Spring, then a subject. Upload one supported file, up to 10 MB.</p>
            {subjectStatus === "loading" && <p role="status">Loading subjects…</p>}
            {subjectStatus === "ready" && state.subjects.length === 0 && <p>No subjects are available for this term.</p>}
            {subjectStatus === "error" && <p role="alert">Subjects could not be loaded.{" "}
              <button type="button" onClick={() => fetchSubjects(state.term)}>Try again</button>
            </p>}
            {message && <p role={uploadStatus === "error" ? "alert" : "status"}>{message}</p>}
            <table>
              <tbody>

                <tr>
                  <td>Year : </td>
                  <td>
                    <select
                      value={state.year}
                      aria-label="Year"
                      name="year"
                      id="year"
                      required
                      onChange={e => {
                        subjectRequest.current++;
                        setSubjectStatus("idle");
                        dispatch({
                          type: "setYear",
                          payload: e.target.value
                        });
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
                      value={state.term}
                      aria-label="Term"
                      name="term"
                      id="term"
                      onChange={e => fetchSubjects(e.target.value)}
                      disabled={state.year === "select-year" ? true : false}
                      required
                    >
                      <option value="select-term">Select Term</option>
                      <option value="fall">Fall</option>
                      <option value="spring">Spring</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Subject : </td>
                  <td>
                    <select
                      value={state.subject}
                      aria-label="Subject"
                      name="subject"
                      id="subject"
                      onChange={e => dispatch({
                        type: "setSubject",
                        payload: e.target.value
                      })}
                      disabled={state.term === "select-term" ? true : false}
                      required
                    >
                      <option value="select-subject">Select Subject</option>
                      {state.subjects.map(sub => {
                        return (
                          <option
                            key={sub._id}
                            value={sub._id}
                          >{sub.name}</option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Upload file from device : </td>
                  <td>
                    <FieldHelp id="resource-file-hint" label="Resource file" hint="PDF, TXT, PNG, JPG, Word, PowerPoint, Excel, or ZIP. Maximum 10 MB.">
                    <input
                      type="file"
                      aria-label="Resource file" aria-describedby="resource-file-hint"
                      accept=".pdf,.txt,.png,.jpg,.jpeg,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                      className="custom-file-input"
                      name="file"
                      id="file"

                      required
                      ref={fileInput}
                      disabled={state.subject === "select-subject" ? true : false}
                    />
                    </FieldHelp>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <button type="submit" disabled={uploadStatus === "loading"}>{uploadStatus === "loading" ? "Submitting…" : "Submit resource"}</button>
                  </td>
                </tr>

              </tbody>
            </table>
          </form>
        </div>
      </Panel>
    </Workspace>
  );
};
export default AddResources;
