import React from "react";

import Taskitembox from "./Taskitembox";

const Tasklistbox = ({ tasks, deleteTask }) => {
  return (
    <div className="tasklistbox">
      <ul className="tasks">
        {tasks
          .sort((a, b) => b.id - a.id)
          .map((task) => (
            <Taskitembox key={task.id} task={task} deleteTask={deleteTask} />
          ))}
      </ul>
    </div>
  );
};

export default Tasklistbox;
