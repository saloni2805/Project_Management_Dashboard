import { useState, useEffect } from "react"
import "./App.css"

export default function App() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [route, setRoute] = useState("ProjectsList")

  useEffect(() => {
    const saved = localStorage.getItem("projects")
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects))
    }
  }, [projects])

  const saveProject = (title, description) => {
    if (title && description !== "") {
      const newProject = {
        id: Date.now(),
        title,
        description,
        tasks: [],
      }
      setProjects((prev) => [...prev, newProject])
      setRoute("ProjectsList")
    } else {
      alert("Both title and description required")
    }
  }

  const updateProject = (id, title, description) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title, description } : p))
    )
    setRoute("ProjectsList")
  }

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setRoute("ProjectsList")
  }

  const addTask = (projectId, task) => {
    const newTask = { ...task, id: Date.now() }
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
      )
    )
  }

  const deleteTask = (taskId) => {
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        tasks: p.tasks.filter((t) => t.id !== taskId),
      }))
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
    alert("Task updated successfully")
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <>
      {" "}
      <h1>Project Management Dashboard</h1>
      {route === "ProjectsList" && (
        <>
          {" "}
          <div className="btn1">
            <button onClick={() => setRoute("AddProject")}>New Project</button>{" "}
          </div>{" "}
          <div className="project-list">
            {" "}
            <ul>
              {projects.map((project) => (
                <li key={project.id} className="project-card">
                  {" "}
                  <div className="project-info">
                    {" "}
                    <h3>{project.title}</h3> <p>{project.description}</p>{" "}
                  </div>{" "}
                  <div className="project-actions">
                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id)
                        setRoute("Tasks")
                      }}
                    >
                      View Tasks{" "}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id)
                        setRoute("EditProject")
                      }}
                    >
                      Edit{" "}
                    </button>
                    <button onClick={() => deleteProject(project.id)}>
                      Delete{" "}
                    </button>{" "}
                  </div>{" "}
                </li>
              ))}{" "}
            </ul>{" "}
          </div>
        </>
      )}
      {route === "AddProject" && (
        <ProjectForm
          onSave={saveProject}
          onCancel={() => setRoute("ProjectsList")}
        />
      )}
      {route === "EditProject" && selectedProject && (
        <ProjectForm
          project={selectedProject}
          onSave={(title, description) =>
            updateProject(selectedProject.id, title, description)
          }
          onCancel={() => setRoute("ProjectsList")}
        />
      )}
      {route === "Tasks" && selectedProject && (
        <TaskForm
          project={selectedProject}
          onSave={(task) => addTask(selectedProject.id, task)}
          onUpdateTask={(taskId, updatedTask) =>
            updateTask(selectedProject.id, taskId, updatedTask)
          }
          onDelete={deleteTask}
          onCancel={() => setRoute("ProjectsList")}
        />
      )}
    </>
  )
}

function ProjectForm({ project = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(project.title || "")
  const [description, setDescription] = useState(project.description || "")

  return (
    <div className="projectform">
      {" "}
      <label htmlFor="title">Project Title</label>
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        id="title"
      />{" "}
      <label htmlFor="description">Project Description</label>
      <input
        type="text"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        id="description"
      />
      <button onClick={() => onSave(title, description)}>Submit</button>{" "}
      <button onClick={onCancel}>Cancel</button>{" "}
    </div>
  )
}

function TaskForm({ project = {}, onSave, onDelete, onCancel, onUpdateTask }) {
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
      {" "}
      <div className="taskform">
        {" "}
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
