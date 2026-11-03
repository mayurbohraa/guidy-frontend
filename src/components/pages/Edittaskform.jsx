import TextEditDialog from "../TextEditDialog";
import { guidyPut } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
export default function Editor({ task, closeEditMode }) {
  return (
    <TextEditDialog
      title="Edit task"
      initialValue={task.taskDescription}
      hint="Up to 60 characters. The description cannot be blank."
      maxLength={60}
      save={(value) =>
        guidyPut(apiRoutes.updateTask(task._id), { taskDescription: value })
      }
      close={closeEditMode}
    />
  );
}
