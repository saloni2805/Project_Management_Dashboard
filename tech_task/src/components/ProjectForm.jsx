import { useState } from "react"
import "../App.css"

const ProjectForm = ({ project = {}, onSave, onCancel }) => {
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

export default ProjectForm
