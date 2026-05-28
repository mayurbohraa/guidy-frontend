import React, { useEffect, useReducer } from "react";

import Tasklist from "../pages/Tasklist";
import Addtaskform from "../pages/Addtaskform";
import apiRoutes from "../../Api/apiRoutes";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { guidyDelete, guidyGet, guidyPost } from "../../Api/api.service";

const initialState = {
  tasks: [],
  isLoading: false,
  isDeleting: false,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case "fetchingTasks":
      return {
        ...state,
        isLoading: true,
      };
    case "taskfetched":
      return {
        ...state,
        isLoading: false,
        tasks: action.payload,
      };
    case "createTask":
      return {
        ...state,
        isLoading: true,
      };
    case "taskCreated":
      return {
        ...state,
        isLoading: false,
        tasks: [state.tasks, action.payload],
      };
    case "updateTask":
      return {
        ...state,
        isLoading: true,
      };
    case "deleteTask":
      return {
        ...state,
      };
    case "deleteAllTask":
      return {
        ...state,
        isDeleting: true,
      };
    case "allTaskDeleted":
      return {
        ...state,
        tasks: [],
      };
    default:
      return state;
  }
};

const MyTasks = () => {
  const naviagte = useNavigate();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    dispatch({ type: "fetchingTasks" });
    const tasks = await guidyGet(apiRoutes.fetchTasks);
    dispatch({ type: "taskfetched", payload: tasks.data });
  }

  async function createTask(task) {
    try {
      dispatch({ type: "createTask" });
      const createdTask = await guidyPost(apiRoutes.createTask, task);
      dispatch({ type: "taskCreated", payload: createdTask });
      toast.success("Task Added !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
      naviagte(0);
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  }

  async function deleteTask(id) {
    try {
      dispatch({ type: "deletingTask" });
      const deleteTask = await guidyDelete(apiRoutes.deleteTask(id));
      dispatch({ type: "taskDeleted", payload: deleteTask });
      toast.success("Task Deleted !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });

      naviagte(0);
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  }

  async function deleteAllTask() {
    try {
      console.log("working");
      dispatch({ type: "deletetAllTasks" });
      const deleteAllTask = await guidyDelete(apiRoutes.deleteAllTask);
      dispatch({ type: "allTaskDeleted", payload: deleteAllTask });
      toast.success("All Task Deleted !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });

      naviagte(0);
    } catch (error) {
      toast.error("No Server Response !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }
  }

  return (
    <div className="myTasks">
      <span>My Tasks</span>

      {/* addtask form */}
      <div className="addEditTask">
        <Addtaskform addTask={createTask} />
      </div>

      {/* task List */}

      {state.isLoading ? (
        <div className="centerItem">
          <div class="loader"></div>
        </div>
      ) : state.tasks.length > 0 ? (
        state.tasks && (
          <Tasklist
            tasks={state.tasks}
            deleteTask={deleteTask}
            deleteAllTask={deleteAllTask}
          />
        )
      ) : (
        <p>No tasks added yet</p>
      )}
      {!state.isDeleting ? (
        <button onClick={deleteAllTask} className="DATasks">
          Delete All Tasks
        </button>
      ) : (
        <p>Deleting...</p>
      )}
    </div>
  );
};

export default MyTasks;
