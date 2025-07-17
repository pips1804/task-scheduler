import { Circle, RotateCcw, CheckCircle } from "lucide-vue-next";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // adjust path as needed

export function useKanban(tasks) {
  const columns = [
    { id: "todo", title: "To Do", icon: Circle },
    { id: "inprogress", title: "In Progress", icon: RotateCcw },
    { id: "completed", title: "Completed", icon: CheckCircle },
  ];

  const onDragStart = (event, task) => {
    event.dataTransfer.setData("text/plain", task.id);
  };

  const onDrop = async (event, newStatus) => {
    const taskId = event.dataTransfer.getData("text/plain");
    const task = tasks.value.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      task.status = newStatus;

      // Persist the updated status to Firestore
      const taskRef = doc(db, "tasks", taskId);
      try {
        await updateDoc(taskRef, { status: newStatus });
      } catch (err) {
        console.error("Error updating task status:", err);
      }
    }
  };

  return {
    columns,
    onDragStart,
    onDrop,
  };
}
