import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import { useAuth } from '../AuthContext';
import axios from 'axios'; 
import { API_BASE_URL } from '../config';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/token/`, credentials);
            // response.data contains { access, refresh, username, email }
            login(response.data);
            navigate('/'); // Redirect to home
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.status === 401) {
                setError('Incorrect username or password. Please try again.');
            } else {
                setError('Failed to login. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
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
                    disabled={loading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
