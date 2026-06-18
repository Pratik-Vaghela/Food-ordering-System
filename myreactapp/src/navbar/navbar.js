import React, { useContext, useState, useRef, useEffect } from 'react';
import './Navbar.css';
import Logo from '../assets/Logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CartContext } from '../cart/CartContext';
import { FiUser, FiShoppingBag, FiLogOut, FiShoppingCart, FiLogIn, FiUserPlus, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useContext(CartContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Extract first letter of username for avatar
    const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img src={Logo} alt="Logo" />
            </div>
            
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <div className="profile-dropdown-container" ref={dropdownRef}>
                        <button 
                            className={`profile-badge-btn ${dropdownOpen ? 'active' : ''}`} 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <div className="avatar-bubble">{avatarLetter}</div>
                            <span className="username-text">{user.username}</span>
                            <FiChevronDown className={`chevron-icon ${dropdownOpen ? 'rotated' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="dropdown-menu animate-scale-in">
                                <div className="dropdown-header">
                                    <div className="dropdown-avatar">{avatarLetter}</div>
                                    <div className="dropdown-user-info">
                                        <div className="dropdown-username">{user.username}</div>
                                        <div className="dropdown-email">{user.email || 'No email set'}</div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link to="/profile" className="dropdown-item">
                                    <FiUser className="item-icon" />
                                    <span>Profile Settings</span>
                                </Link>
                                <Link to="/history" className="dropdown-item">
                                    <FiShoppingBag className="item-icon" />
                                    <span>Order History</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="dropdown-item logout-btn">
                                    <FiLogOut className="item-icon" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login-link">
                            <FiLogIn className="link-icon" />
                            <span>Log In</span>
                        </Link>
                        <Link to="/signin" className="signin-link">
                            <FiUserPlus className="link-icon" />
                            <span>Sign Up</span>
                        </Link>
                    </>
                )}
                <Link to="/cart" className="cart-badge-link">
                    <FiShoppingCart className="link-icon" />
                    <span>Cart ({cartCount})</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
