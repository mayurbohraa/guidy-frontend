import React, { useState } from "react";
import { UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import Edittaskform from "./Edittaskform";

const Taskitem = ({ task, deleteTask }) => {
  const [isChecked, setIsChecked] = useState(task.checked);
  const [isEditing, setIsEditing] = useState(false);
  const [previousFocusEl, setPreviousFocusEl] = useState(null);

  const closeEditMode = () => {
    setIsEditing(false);
    previousFocusEl.focus();
  };

  const enterEditMode = (task) => {
    setIsEditing(true);
    setPreviousFocusEl(document.activeElement);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="taskItem">
      {isEditing ? (
        <Edittaskform task={task} closeEditMode={closeEditMode} />
      ) : (
        <li className="task">
          <div className="task-group">
            <input
              type="checkbox"
              className="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              name={task.taskDescription}
              id={task._id}
            />
            <label htmlFor={task._id} className="label">
              {task.taskDescription}
            </label>
          </div>

          <div className="task-group">
            <button
              className="btn update"
              aria-label={`Update ${task.taskDescription} Task`}
              onClick={() => enterEditMode(task)}
            >
              <span>
                <UilEdit />
              </span>
            </button>

            <button
              className="btn delete"
              aria-label={`Delete ${task.taskDescription} Task`}
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
