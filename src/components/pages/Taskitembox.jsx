import React, { useState } from "react";

import { UilTrashAlt } from "@iconscout/react-unicons";

const Taskitembox = ({ task, deleteTask }) => {
  const [isChecked1, setIsChecked1] = useState(task.checked);
  const handleCheckboxChange = (e) => {
    setIsChecked1(!isChecked1);
  };

  return (
    <div className="taskitembox">
      <li className="task">
        <div className="task-group">
          <input
            type="checkbox"
            className="checkbox"
            checked={isChecked1}
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
    </div>
  );
};

export default Taskitembox;
