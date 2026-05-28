import React, { useEffect, useReducer } from "react";

import Notebooklist from "../pages/Notebooklist";
import apiRoutes from "../../Api/apiRoutes";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { guidyDelete, guidyGet} from "../../Api/api.service";

const initialState = {
  notebooks: [],
  isLoading: false,
  isDeleting: false,
};

const notebookReducer = (state, action) => {
  switch (action.type) {
    case "fetchingNotebooks":
      return {
        ...state,
        isLoading: true,
      };
    case "notebookfetched":
      return {
        ...state,
        isLoading: false,
        notebooks: action.payload,
      };
    case "createNotebook":
      return {
        ...state,
        isLoading: true,
      };
    case "notebookCreated":
      return {
        ...state,
        isLoading: false,
        notebooks: [state.notebooks, action.payload],
      };
    case "updateNotebook":
      return {
        ...state,
        isLoading: true,
      };
    case "deleteNotebook":
      return {
        ...state,
      };
    default:
      return state;
  }
};

const Notes = () => {

  const naviagte = useNavigate();
  const [state, dispatch] = useReducer(notebookReducer, initialState);

  useEffect(() => {
    fetchNotebooks();
  }, []);

  async function fetchNotebooks() {
    dispatch({ type: "fetchingNotebooks" });
    const notebooks = await guidyGet(apiRoutes.fetchNotebooks);
    dispatch({ type: "notebookfetched", payload: notebooks.data });
  }

  async function deleteNotebook(id) {
    try {
      dispatch({ type: "deletingNotebook" });
      const deleteNotebook = await guidyDelete(apiRoutes.deleteNotebook(id));
      dispatch({ type: "notebookDeleted", payload: deleteNotebook });
      toast.success("Notebook Deleted !", {
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
    <div className='notes'>
      <span>Notes</span>

      {/* notebook List */}

      {state.isLoading ? (
        <div className="centerItem">
          <div class="loader"></div>
        </div>
      ) : state.notebooks.length > 0 ? (
        state.notebooks && (
          <Notebooklist
            notebooks={state.notebooks}
            deleteNotebook={deleteNotebook}
          />
        )
      ) : (
        <p>No notebooks added yet</p>
      )}
    </div>
  )
}

export default Notes