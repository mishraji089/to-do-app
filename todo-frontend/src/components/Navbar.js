// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'; // Use App.css for general styling, or create Navbar.css

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        My Todo App
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="username">Hello, {user?.username}</span>
            <Link to="/" className="nav-link">Todos</Link>
            <button onClick={handleLogout} className="btn btn-danger nav-link">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            {/* Registration is part of the login page, so no separate link needed here for simplicity */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;