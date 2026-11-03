import React from "react";

import Taskitem from "./Taskitem";
const Tasklist = ({
  tasks,
  deleteTask
}) => {
  return (
    <div className="taskList">
      <ul className="tasks">
        {tasks.map(task => <Taskitem
          key={task._id}
          task={task}
          deleteTask={deleteTask}
        />)}
      </ul>
    </div>
  );
};
export default Tasklist;
