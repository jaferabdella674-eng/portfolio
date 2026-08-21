app.js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // ===== States =====
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  // ===== Save to LocalStorage =====
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ===== Add Task =====
  const addTask = () => {
    if (!taskText.trim()) return;
    setTasks([
      ...tasks,
      { text: taskText, completed: false }
    ]);
    setTaskText("");
  };

  // ===== Toggle Complete =====
  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // ===== Delete Task =====
  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="container">
      <h1>React To-Do App ✅</h1>

      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            className={task.completed ? "completed" : ""}
          >
            <span onClick={() => toggleComplete(index)}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(index)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;