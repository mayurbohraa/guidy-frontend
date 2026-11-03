import FieldHelp from "../FieldHelp";
import React, { useState } from "react";

import { guidyPut } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { useNavigate } from "react-router-dom";
import { UilCheck } from "@iconscout/react-unicons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Editnotebookform = ({
  notebook,
  closeEditMode
}) => {
  const navigate = useNavigate();
  const [updatedNotebookName, setUpdatedNotebookName] = useState(notebook.notebookContent);
  const handleFormSubmit = async e => {
    try {
      e.preventDefault();
      await guidyPut(apiRoutes.updateNotebook(notebook._id), {
        notebookContent: updatedNotebookName
      });
      closeEditMode();
      toast.success("Notebook Updated !", {
        position: "top-right",
        theme: "colored",
        toastId: 1
      });
      navigate(0);
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1
      });
    }
  };
  return (
    <div
      className="editnotebookform"
      role="dialog"
      aria-labelledby="editNotebook"
    >
      <form
        className="todo wrapper2"
        onSubmit={handleFormSubmit}
      >
        <FieldHelp id="edit-notebook-hint" label="Notebook content" hint="Enter your study notes. Content cannot be blank.">
        <input
          type="text"
          id="editNotebook"
          aria-label="Notebook content" aria-describedby="edit-notebook-hint"
          className="input"
          value={updatedNotebookName}
          onInput={e => setUpdatedNotebookName(e.target.value)}
          required
          autoFocus
          placeholder="Update Notebook"
        />
        </FieldHelp>

        <button
          className="btn"
          aria-label={`Confirm edited notebook to now read ${notebook.notebookContent}`}
          type="submit"
        >
          <span>
            <UilCheck />
          </span>
        </button>

      </form>
    </div>
  );
};
export default Editnotebookform;
