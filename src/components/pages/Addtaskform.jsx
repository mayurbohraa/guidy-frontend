import React, { useState } from "react";

import { UilPlus } from "@iconscout/react-unicons";

const Addtaskform = ({ addTask }) => {
  const [task, setTask] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    addTask({
      taskDescription: task,
    });
    setTask("");
  };

  return (
    <div className="addtaskform">
      <form className="todo wrapper" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name=""
          id="task"
          value={task}
          onInput={(e) => setTask(e.target.value)}
          className="Input"
          placeholder="Add a new task"
          required
          autoFocus
          maxLength={60}
        />
        <button className="btn" aria-label="Add Task" type="submit">
          <span>
            <UilPlus />
          </span>
        </button>
      </form>
    </div>
  );
};

export default Addtaskform;
