import React, { useState, useEffect } from 'react';
import './App.css'; // We'll add some basic CSS later

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const API_URL = '/api/todos'; // Proxied to http://localhost:8080/api/todos

  // Fetch todos from the backend when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!newTodoDescription.trim()) return; // Don't add empty todos

    const newTodo = {
      description: newTodoDescription,
      completed: false
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]); // Add the new todo to the state
      setNewTodoDescription(''); // Clear input field
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleCompleted = async (id) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedUpdatedTodo = await response.json(); // Get the updated todo from backend
      setTodos(todos.map(todo => (todo.id === id ? fetchedUpdatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        // For DELETE, 204 No Content is common and means success
        if (response.status !== 204) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      setTodos(todos.filter(todo => todo.id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleCompleted(todo.id)}>
              {todo.description}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;