import FieldHelp from "../FieldHelp";
import React, { useState } from "react";

import { guidyPut } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { useNavigate } from "react-router-dom";
import { UilCheck } from "@iconscout/react-unicons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Edittaskform = ({
  task,
  closeEditMode
}) => {
  const navigate = useNavigate();
  const [updatedTaskName, setUpdatedTaskName] = useState(task.taskDescription);
  const handleFormSubmit = async e => {
    try {
      e.preventDefault();
      await guidyPut(apiRoutes.updateTask(task._id), {
        taskDescription: updatedTaskName
      });
      closeEditMode();
      toast.success('Task Updated !', {
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
      className="edittaskform"
      role="dialog"
      aria-labelledby="editTask"
    >
      <form
        className="todo wrapper2"
        onSubmit={handleFormSubmit}
      >
        <FieldHelp id="edit-task-hint" label="Task description" hint="Up to 60 characters. The description cannot be blank.">
        <input
          type="text"
          id="editTask"
          aria-label="Task description" aria-describedby="edit-task-hint"
          className="input"
          value={updatedTaskName}
          onInput={e => setUpdatedTaskName(e.target.value)}
          required
          autoFocus
          maxLength={60}
          placeholder="Update Task"
        />
        </FieldHelp>

        <button
          className="btn"
          aria-label={`Confirm edited task to now read ${task.taskDescription}`}
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
export default Edittaskform;
