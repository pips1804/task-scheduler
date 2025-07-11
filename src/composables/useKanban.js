import { Circle, RotateCcw, CheckCircle } from "lucide-vue-next"

export function useKanban(tasks) {
  const columns = [
    { id: "todo", title: "To Do", icon: Circle },
    { id: "inprogress", title: "In Progress", icon: RotateCcw },
    { id: "completed", title: "Completed", icon: CheckCircle },
  ]

  const onDragStart = (event, task) => {
    event.dataTransfer.setData("text/plain", task.id)
  }

  const onDrop = (event, newStatus) => {
    const taskId = event.dataTransfer.getData("text/plain")
    const task = tasks.value.find((t) => t.id === taskId)

    if (task) {
      task.status = newStatus
    }
  }

  return {
    columns,
    onDragStart,
    onDrop,
  }
}
