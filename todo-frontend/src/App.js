import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for simpler request configuration
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import PrivateRoute from './PrivateRoute';

// --- TodoList Component (Moved for clarity, could be in its own file) ---
function TodoListContent() {
  const [todos, setTodos] = useState([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const { getAuthHeader } = useAuth(); // Get auth header from context

  const API_URL = '/api/todos';

  // Fetch todos from the backend when the component mounts or auth changes
  useEffect(() => {
    fetchTodos();
  }, [getAuthHeader]); // Rerun when auth changes (e.g., login/logout)

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL, { headers: getAuthHeader() });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      // Handle unauthorized errors, maybe redirect to login
      if (error.response && error.response.status === 401) {
        // This should be handled by PrivateRoute, but good to have here too
        console.log("Unauthorized, please login.");
      }
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoDescription.trim()) return;

    const newTodo = {
      description: newTodoDescription,
      completed: false
    };

    try {
      const response = await axios.post(API_URL, newTodo, { headers: getAuthHeader() });
      setTodos([...todos, response.data]);
      setNewTodoDescription('');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleCompleted = async (id) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTodo, { headers: getAuthHeader() });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="container">
      <h1>My Todos</h1>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit" className="btn btn-primary">Add Todo</button>
      </form>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <p>No todos yet. Add one!</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => handleToggleCompleted(todo.id)}>
                {todo.description}
              </span>
              <button onClick={() => handleDeleteTodo(todo.id)} className="btn btn-danger">
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// --- Main App Component ---
function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<TodoListContent />} />
          </Route>
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;