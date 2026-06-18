import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCheck, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { API_BASE_URL } from '../config';

const Profile = () => {
    const { getAuthHeaders, updateUser, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/profile/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        username: data.username || '',
                        email: data.email || '',
                        first_name: data.first_name || '',
                        last_name: data.last_name || ''
                    });
                } else {
                    setMessage({ type: 'error', text: 'Failed to load profile settings. Please try again.' });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Network error occurred while fetching profile.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate, getAuthHeaders]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name
                })
            });

            if (response.ok) {
                const data = await response.json();
                updateUser({ email: data.email });
                setMessage({ type: 'success', text: 'Profile settings updated successfully!' });
                
                // Clear success message after 4 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 4000);
            } else {
                const errorData = await response.json();
                const errorText = Object.values(errorData).flat().join(' ') || 'Failed to update profile settings.';
                setMessage({ type: 'error', text: errorText });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error occurred while updating profile.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading-container">
                <FiLoader className="spinner-icon animate-spin" />
                <p>Loading your profile settings...</p>
            </div>
        );
    }

    const avatarLetter = formData.username ? formData.username.charAt(0).toUpperCase() : 'U';

    return (
        <div className="profile-page-wrapper animate-fade-in">
            <div className="profile-container">
                <div className="profile-card-left">
                    <div className="profile-avatar-large">{avatarLetter}</div>
                    <h2 className="profile-user-title">@{formData.username}</h2>
                    <p className="profile-user-email">{formData.email}</p>
                    <div className="profile-meta-info">
                        <span className="meta-badge">SaaS User</span>
                        <div className="meta-member-since">Active Account</div>
                    </div>
                </div>

                <div className="profile-form-right">
                    <div className="form-header">
                        <h2>Account Settings</h2>
                        <p>Manage your public profile information and email address.</p>
                    </div>

                    {message.text && (
                        <div className={`status-message-alert ${message.type}`}>
                            {message.type === 'success' ? (
                                <FiCheck className="alert-icon" />
                            ) : (
                                <FiAlertTriangle className="alert-icon" />
                            )}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-grid">
                            <div className="form-group disabled">
                                <label htmlFor="username">Username</label>
                                <div className="input-wrapper">
                                    <FiUser className="input-field-icon" />
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        value={formData.username} 
                                        disabled 
                                    />
                                </div>
                                <span className="helper-text">Usernames cannot be changed.</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <FiMail className="input-field-icon" />
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="first_name" 
                                        name="first_name" 
                                        value={formData.first_name} 
                                        onChange={handleChange} 
                                        placeholder="First name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="last_name" 
                                        name="last_name" 
                                        value={formData.last_name} 
                                        onChange={handleChange} 
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-footer">
                            <button 
                                type="submit" 
                                className={`save-settings-btn ${submitting ? 'submitting' : ''}`}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <FiLoader className="btn-spinner animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <span>Save Settings</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
