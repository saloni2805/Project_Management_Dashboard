import { useState, useEffect } from "react"

export default function App() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [view, setView] = useState("projectList") // 'projectList', 'newProject', 'editProject', 'taskList'

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projects")) || []
    setProjects(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects))
  }, [projects])

  const addProject = (title, description) => {
    const newProject = {
      id: Date.now(),
      title,
      description,
      tasks: [],
    }
    setProjects([...projects, newProject])
    setView("projectList")
  }

  const updateProject = (id, title, description) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, title, description } : p))
    )
    setView("projectList")
  }

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id))
    setSelectedProjectId(null)
    setView("projectList")
  }

  const addTask = (projectId, task) => {
    setProjects(
      projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, tasks: [...p.tasks, { ...task, id: Date.now() }] }
        }
        return p
      })
    )
  }

  const updateTask = (projectId, taskId, updatedTask) => {
    setProjects(
      projects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === taskId ? { ...t, ...updatedTask } : t
            ),
          }
        }
        return p
      })
    )
  }

  const deleteTask = (projectId, taskId) => {
    setProjects(
      projects.map((p) => {
        if (p.id === projectId) {
          return { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
        }
        return p
      })
    )
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Management Dashboard</h1>

      {view === "projectList" && (
        <div>
          <button
            onClick={() => setView("newProject")}
            className="bg-blue-500 text-white px-4 py-2 mb-4"
          >
            New Project
          </button>
          <ul>
            {projects.map((p) => (
              <li key={p.id} className="border p-2 mb-2">
                <div className="font-semibold">{p.title}</div>
                <div>{p.description}</div>
                <button
                  onClick={() => {
                    setSelectedProjectId(p.id)
                    setView("taskList")
                  }}
                  className="text-blue-500"
                >
                  View Tasks
                </button>
                <button
                  onClick={() => {
                    setSelectedProjectId(p.id)
                    setView("editProject")
                  }}
                  className="ml-2 text-green-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === "newProject" && (
        <ProjectForm
          onSave={addProject}
          onCancel={() => setView("projectList")}
        />
      )}

      {view === "editProject" && selectedProject && (
        <ProjectForm
          initial={selectedProject}
          onSave={(title, description) =>
            updateProject(selectedProject.id, title, description)
          }
          onCancel={() => setView("ProjectList")}
        />
      )}

      {view === "taskList" && selectedProject && (
        <TaskManager
          project={selectedProject}
          onBack={() => setView("projectList")}
          onAddTask={(task) => addTask(selectedProject.id, task)}
          onUpdateTask={(taskId, updatedTask) =>
            updateTask(selectedProject.id, taskId, updatedTask)
          }
          onDeleteTask={(taskId) => deleteTask(selectedProject.id, taskId)}
        />
      )}
    </div>
  )
}

function ProjectForm({ initial = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(initial.title || "")
  const [description, setDescription] = useState(initial.description || "")

  return (
    <div className="border p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-1 mb-2 w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-1 mb-2 w-full"
      />
      <div>
        <button
          onClick={() => onSave(title, description)}
          className="bg-green-500 text-white px-4 py-1 mr-2"
        >
          Save
        </button>
        <button onClick={onCancel} className="bg-gray-300 px-4 py-1">
          Cancel
        </button>
      </div>
    </div>
  )
}

function TaskManager({
  project,
  onBack,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const [filter, setFilter] = useState("all")
  const [sortAsc, setSortAsc] = useState(true)
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    status: "Pending",
  })

  const validDate = (date) =>
    new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)

  const filtered = project.tasks.filter(
    (t) => filter === "all" || t.status === filter
  )

  const sorted = [...filtered].sort((a, b) =>
    sortAsc
      ? new Date(a.dueDate) - new Date(b.dueDate)
      : new Date(b.dueDate) - new Date(a.dueDate)
  )

  const counters = project.tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <button onClick={onBack} className="mb-2 text-blue-500">
        ← Back to Projects
      </button>
      <h2 className="text-xl font-bold mb-2">Tasks for {project.title}</h2>

      <div className="mb-2">
        <input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task Title"
          className="border p-1 mr-2"
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="border p-1 mr-2"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="border p-1 mr-2"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button
          onClick={() => {
            if (!newTask.title.trim()) return alert("Title is required")
            if (!validDate(newTask.dueDate))
              return alert("Date must be today or in future")
            onAddTask(newTask)
            setNewTask({ title: "", dueDate: "", status: "Pending" })
          }}
          className="bg-blue-500 text-white px-2 py-1"
        >
          Add Task
        </button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div>
          Filter:
          <select onChange={(e) => setFilter(e.target.value)} className="ml-1">
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          Sort:
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="ml-1 text-blue-500"
          >
            {sortAsc ? "↑ Due Date" : "↓ Due Date"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        {Object.entries(counters).map(([status, count]) => (
          <span key={status} className="mr-4">
            {status}: {count}
          </span>
        ))}
      </div>

      <ul>
        {sorted.map((task) => (
          <li key={task.id} className="border p-2 mb-2">
            <div className="font-semibold">{task.title}</div>
            <div>Due: {task.dueDate}</div>
            <div>Status: {task.status}</div>
            <button
              onClick={() => {
                const updated = prompt("Edit title", task.title)
                if (updated && updated.trim()) {
                  onUpdateTask(task.id, { title: updated })
                }
              }}
              className="text-green-500 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
