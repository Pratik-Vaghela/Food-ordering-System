import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './signin.css'; 
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';

const UserForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('User created successfully!');
                
                // Auto-login the user immediately after signup
                try {
                    const loginResponse = await fetch(`${API_BASE_URL}/api/token/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: formData.username,
                            password: formData.password
                        })
                    });
                    if (loginResponse.ok) {
                        const authData = await loginResponse.json();
                        login(authData);
                        navigate('/');  // Redirect to the home page
                        return;
                    }
                } catch (autoLoginErr) {
                    console.error('Auto login failed:', autoLoginErr);
                }
                
                // If auto-login fails, redirect to login page
                navigate('/login');
            } else {
                const errData = await response.json();
                // Format errors if field-specific
                if (typeof errData === 'object') {
                    const messages = Object.entries(errData)
                        .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
                        .join('\n');
                    setError(messages || 'Failed to create user.');
                } else {
                    setError('Failed to create user. Please check your entries.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Create User</h1>
            {error && <pre className="error-message" style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</pre>}
            <form className="form form-control" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;
