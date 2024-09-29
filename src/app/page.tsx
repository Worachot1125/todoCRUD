"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

interface Todo {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  duedate: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    name: "",
    description: "",
    duedate: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch all todos (READ)
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/todo", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success) {
        setTodos(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo (CREATE)
  const createTodo = async () => {
    try {
      const res = await fetch("/api/v1/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      const data = await res.json();
      if (data.success) {
        setTodos([...todos, data.data]);
        setNewTodo({ name: "", description: "", duedate: "" }); // Reset form
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Update todo status (UPDATE)
  const updateTodoStatus = async (id: string, status: boolean) => {
    try {
      const res = await fetch("/api/v1/todo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: !status }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, status: !status } : todo
          )
        );
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  // Delete todo (DELETE)
  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch("/api/v1/todo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos(todos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className={styles.page}>
      <h1>Todo List</h1>

      {/* Create new todo */}
      <div className={styles.createTodo}>
        <h2>Create New Task</h2>
        <input
          type="text"
          placeholder="Task Name"
          value={newTodo.name}
          onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
        />
        <textarea
          placeholder="Task Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTodo.duedate}
          onChange={(e) =>
            setNewTodo({ ...newTodo, duedate: e.target.value })
          }
        />
        <button onClick={createTodo}>Create Task</button>
      </div>

      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display all todos */}
      <div className={styles.todoList}>
        <h2>Todo List</h2>
        {todos.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo._id} className={styles.todoItem}>
                <h3
                  style={{
                    textDecoration: todo.status ? "line-through" : "none",
                  }}
                >
                  {todo.name}
                </h3>
                <p>{todo.description}</p>
                <p>Status: {todo.status ? "Completed" : "Pending"}</p>
                <p>Due Date: {new Date(todo.duedate).toLocaleDateString()}</p>
                <button
                  onClick={() => updateTodoStatus(todo._id, todo.status)}
                >
                  {todo.status ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
