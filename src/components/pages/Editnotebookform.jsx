import TextEditDialog from "../TextEditDialog";
import { guidyPut } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
export default function Editor({ notebook, closeEditMode }) {
  return (
    <TextEditDialog
      title="Edit notebook"
      initialValue={notebook.notebookContent}
      hint="Enter your study notes. The content cannot be blank."
      multiline
      save={(value) =>
        guidyPut(apiRoutes.updateNotebook(notebook._id), {
          notebookContent: value,
        })
      }
      close={closeEditMode}
    />
  );
}
