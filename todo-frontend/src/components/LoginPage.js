// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // Import the new CSS

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isLoginMode) {
      const result = await login(username, password);
      if (result.success) {
        navigate('/'); // Redirect to home/todos page on successful login
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } else {
      const result = await register(username, password);
      if (result.success) {
        setMessage(result.message || 'Registration successful! Please login.');
        setIsLoginMode(true); // Switch to login mode after successful registration
      } else {
        setError(result.message || 'Registration failed. Username might be taken.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>} {/* Add success message style in App.css */}
          <button type="submit" className="btn btn-primary">
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="toggle-link">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;