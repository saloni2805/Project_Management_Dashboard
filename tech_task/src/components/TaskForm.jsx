import { useState } from "react"
import "../App.css"

const TaskForm = ({
  project = {},
  onSave,
  onDelete,
  onCancel,
  onUpdateTask,
}) => {
  const [sortAsc, setSortAsc] = useState(true)
  const [filter, setFilter] = useState("all")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    status: "Pending",
  })

  const filtered = project.tasks.filter(
    (t) => filter === "all" || t.status === filter
  )

  const sorted = [...filtered].sort((a, b) =>
    sortAsc
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate)
  )

  return (
    <>
      <div className="taskform">
        <label htmlFor="tasktitle">Task Title</label>
        <input
          type="text"
          name="tasktitle"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          id="tasktitle"
        />{" "}
        <label htmlFor="duedate">Due Date</label>
        <input
          type="date"
          name="duedate"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          id="duedate"
        />{" "}
        <label htmlFor="status">Status</label>
        <select
          name="status"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          {" "}
          <option value="Pending">Pending</option>{" "}
          <option value="In Progress">In Progress</option>{" "}
          <option value="Done">Done</option>{" "}
        </select>
        <button
          onClick={() => {
            if (!newTask.title.trim()) return alert("Task title is required")
            if (!newTask.dueDate) return alert("Due date is required")

            if (editingTaskId) {
              onUpdateTask(editingTaskId, newTask)
            } else {
              onSave(newTask)
            }

            setNewTask({ title: "", dueDate: "", status: "Pending" })
            setEditingTaskId(null)
          }}
        >
          {editingTaskId ? "Update" : "Submit"}
        </button>
        <button onClick={onCancel}>Back to Projects</button>
      </div>
      <div className="action-tasks">
        <div style={{ marginTop: "20px", marginRight: "20px" }}>
          Filter:
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          Sort:
          <button onClick={() => setSortAsc(!sortAsc)}>
            {sortAsc ? "↑ Due Date" : "↓ Due Date"}
          </button>
        </div>
      </div>
      <div className="project-list">
        <ul>
          {sorted.map((task) => (
            <li key={task.id} className="project-card">
              <div className="project-info">
                <h4>{task.title}</h4>
                <p>Due: {task.dueDate}</p>
                <p>Status: {task.status}</p>
              </div>

              <div className="project-actions">
                <button
                  onClick={() => {
                    setNewTask({
                      title: task.title,
                      dueDate: task.dueDate,
                      status: task.status,
                    })
                    setEditingTaskId(task.id)
                  }}
                >
                  Edit
                </button>

                <button onClick={() => onDelete(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default TaskForm
