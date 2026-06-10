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

    const { login } = useAuth();
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/User/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const user = await response.json(); 
                console.log('User created successfully!');

                login(user)
                navigate('/');  // Redirect to the home page
            } else {
                console.error('Failed to create user');
               
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="form-container">
            <h1>Create User</h1>
            <form className="form form-control" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default UserForm;
