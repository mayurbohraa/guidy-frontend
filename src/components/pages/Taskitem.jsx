import { guidyPut } from "../../Api/api.service";

import apiRoutes from "../../Api/apiRoutes";
import React, { useState } from "react";
import { UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import Edittaskform from "./Edittaskform";
const Taskitem = ({ task, deleteTask }) => {
  const [currentTask, setCurrentTask] = useState(task);
  const [failure, setFailure] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isChecked, setIsChecked] = useState(Boolean(task.checked));
  const [isEditing, setIsEditing] = useState(false);
  const [previousFocusEl, setPreviousFocusEl] = useState(null);
  const closeEditMode = (value) => {
    if (typeof value === "string")
      setCurrentTask((current) => ({ ...current, taskDescription: value }));
    setIsEditing(false);
    previousFocusEl?.focus();
  };
  const enterEditMode = (task) => {
    setIsEditing(true);
    setPreviousFocusEl(document.activeElement);
  };
  const handleCheckboxChange = async () => {
    if (updating) return;
    setUpdating(true);
    setFailure("");
    try {
      const response = await guidyPut(apiRoutes.updateTask(task._id), {
        checked: !isChecked,
      });
      setIsChecked(Boolean(response.data.checked));
    } catch {
      setFailure("This task could not be updated. Try again.");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <div className="taskItem">
      {failure && <p role="alert">{failure}</p>}
      {isEditing ? (
        <Edittaskform task={currentTask} closeEditMode={closeEditMode} />
      ) : (
        <li className="task">
          <div className="task-group">
            <input
              type="checkbox"
              className="checkbox"
              checked={isChecked}
              disabled={updating}
              onChange={handleCheckboxChange}
              name={currentTask.taskDescription}
              id={task._id}
            />
            <label htmlFor={task._id} className="label">
              {currentTask.taskDescription}
            </label>
          </div>

          <div className="task-group">
            <button
              className="btn update"
              aria-label={`Update ${currentTask.taskDescription} Task`}
              onClick={() => enterEditMode(task)}
            >
              <span>
                <UilEdit />
              </span>
            </button>

            <button
              className="btn delete"
              aria-label={`Delete ${currentTask.taskDescription} Task`}
              onClick={() => deleteTask(task._id)}
            >
              <span>
                <UilTrashAlt />
              </span>
            </button>
          </div>
        </li>
      )}
    </div>
  );
};
export default Taskitem;
