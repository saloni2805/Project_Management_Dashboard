import { useState, useEffect } from "react"
import "./App.css"
import ProjectForm from "./components/ProjectForm"
import TaskForm from "./components/TaskForm"

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
