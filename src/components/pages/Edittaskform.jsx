import React, { useState } from "react";
import {guidyPut} from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { useNavigate } from "react-router-dom";
import { UilCheck } from "@iconscout/react-unicons";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Edittaskform = ({ task,closeEditMode }) => {
  const naviagte = useNavigate();
  const [updatedTaskName, setUpdatedTaskName] = useState(task.taskDescription);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
    const response  = await guidyPut(apiRoutes.updateTask(task._id),{taskDescription:updatedTaskName})
    console.log(response);
    closeEditMode();
    toast.success('Task Updated !', {
      position: "top-right",
      theme: "colored",
      toastId:1
    });

    naviagte(0);
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
      toastId:1
      });

    }
    
  };

  return (
    <div className="edittaskform" role="dialog" aria-labelledby="editTask">
      <form className="todo wrapper2" onSubmit={handleFormSubmit}>
        <input
          type="text"
          id="editTask"
          className="input"
          value={updatedTaskName}
          onInput={(e) => setUpdatedTaskName(e.target.value)}
          required
          autoFocus
          maxLength={60}
          placeholder="Update Task"
        />

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
