import React, { useState } from "react";

import { UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import Editnotebookform from "./Editnotebookform";
import Popup from "../Popup";
const Notebookitem = ({
  notebook,
  deleteNotebook
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previousFocusEl, setPreviousFocusEl] = useState(null);
  const closeEditMode = () => {
    setIsEditing(false);
    previousFocusEl?.focus();
  };
  const enterEditMode = notebook => {
    setIsEditing(true);
    setPreviousFocusEl(document.activeElement);
  };
  const [isShown, setIsShown] = useState(false);
  const handleClick = event => {
    setIsShown(!isShown);
  };
  return (
    <div className="notebookItem">
      {isEditing ? <Editnotebookform
        notebook={notebook}
        closeEditMode={closeEditMode}
      /> : <li className="notebook">

        <div className="notebook-group">
          <label
            htmlFor={notebook._id}
            className="label"
          >
            <span style={{
              fontWeight: "bold"
            }}>Notebook Title:</span>{" "}
            {notebook.notebookTitle}
          </label>
          <br />
          <label
            htmlFor={notebook._id}
            className="label"
          >
            <span style={{
              fontWeight: "bold"
            }}>Subject:</span>{" "}
            {notebook.subject?.name}
          </label>
          <br />
          <label
            htmlFor={notebook._id}
            className="label"
          >
            <span style={{
              fontWeight: "bold"
            }}>Notebook Content: </span>{" "}


            <button
              type="button"
              onClick={handleClick}
              style={{
                color: "red"
              }}
            >
              View Note
            </button>
            {isShown &&
              <Popup
                content={<div>{notebook.notebookContent}</div>}
                handleClose={handleClick}
              />
            }
          </label>
        </div>

        <div className="notebook-group">
          <button
            className="btn update"
            aria-label={`Update ${notebook.notebookContent} Notebook`}
            onClick={() => enterEditMode(notebook)}
          >
            <span>
              <UilEdit />
            </span>
          </button>

          <button
            className="btn delete"
            aria-label={`Delete ${notebook.notebookContent} Notebook`}
            onClick={() => deleteNotebook(notebook._id)}
          >
            <span>
              <UilTrashAlt />
            </span>
          </button>
        </div>
      </li>}
    </div>
  );
};
export default Notebookitem;
