import React from "react";

import Notebookitem from "./Notebookitem";
const Notebooklist = ({
  notebooks,
  deleteNotebook
}) => {
  return (
    <div className="notebookList">
      <ul className="notebooks">
        {notebooks.map(notebook => <Notebookitem
          key={notebook._id}
          notebook={notebook}
          deleteNotebook={deleteNotebook}
        />)}
      </ul>
    </div>
  );
};
export default Notebooklist;
