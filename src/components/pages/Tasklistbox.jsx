import React from "react";

import Taskitembox from "./Taskitembox";
const Tasklistbox = ({
  tasks,
  deleteTask
}) => {
  return (
    <div className="tasklistbox">
      <ul className="tasks">
        {tasks.map(task => <Taskitembox
          key={task._id}
          task={task}
          deleteTask={deleteTask}
        />)}
      </ul>
    </div>
  );
};
export default Tasklistbox;
