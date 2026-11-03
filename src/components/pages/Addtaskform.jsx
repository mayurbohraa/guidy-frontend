import FieldHelp from "../FieldHelp";
import { useState } from "react";

export default function Addtaskform({ addTask, disabled }) {
  const [task, setTask] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (disabled || !task.trim()) return;
    if (await addTask({ taskDescription: task.trim() })) setTask("");
  }

  return (
    <form className="workspace-actions workspace-task-form" onSubmit={submit}>
      <FieldHelp id="task-format-hint" label="New task" hint="Enter a short task description, up to 60 characters.">
      <input type="text" aria-label="New task" aria-describedby="task-format-hint" placeholder="Add a new task" maxLength={60}
        value={task} onChange={(event) => setTask(event.target.value)} required />
      </FieldHelp>
      <button className="workspace-button" type="submit" disabled={disabled}>Add task</button>
    <small id="task-format-hint" className="guidy-field-hint">Enter a short task description, up to 60 characters.</small>
    </form>
  );
}
