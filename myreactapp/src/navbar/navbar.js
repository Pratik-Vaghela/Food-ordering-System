// src/Navbar.js
import React, { useContext } from 'react';
import './Navbar.css';
import Logo from '../assets/Logo.png'
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CartContext } from '../cart/CartContext'; 

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useContext(CartContext); 

    return (
        <nav className="navbar">
            <div className="logo"> 
                <img src={Logo} alt="Logo" />
            </div>
            
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <span>{user.username}</span>
                        <button onClick={logout}>Logout</button>
                        <Link to='/history'>History</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Log In</Link>
                        <Link to="/signin">Sign In</Link>
                    </>
                )}
                <Link to="/cart">🛒 Cart ({cartCount})</Link> 
            </div>
        </nav>
    );
};

export default Navbar;
