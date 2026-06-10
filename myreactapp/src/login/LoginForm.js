import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import { useAuth } from '../AuthContext';
import axios from 'axios'; 
import { API_BASE_URL } from '../config';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]); // State to store all users
    const { login } = useAuth();
    const navigate = useNavigate();

    // Fetch all users using axios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/UserList/`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        let validUser = null; // Variable to store the matched user

        // Iterate over the users using a loop to validate the credentials
        for (let user of users) {
            if (user.username === credentials.username) {
                if (user.password === credentials.password) {
                    validUser = user;
                    login(user)
                     
                    // Set the valid user if both username and password match
                    break; 
                } else {
                    setError('Incorrect password. Please try again.');
                    return; // Exit the function after finding the user and incorrect password
                }
            }
        }

        // If no user was found, show the appropriate error
        if (!validUser) {
            setError('Username not found. Please try again.');
            return;
        }

        // If credentials are valid, log in the user
        login(validUser);
        navigate('/'); // Redirect to home
    };

    return (
        <div className="login-form-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
