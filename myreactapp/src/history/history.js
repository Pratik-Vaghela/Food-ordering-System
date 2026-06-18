import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios'; 
import './History.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const History = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const { user, getAuthHeaders } = useAuth(); 
    const navigate = useNavigate();
    useEffect(() => {
        // Check if the user is logged in
        if (user && user.username) {
            // Fetch the history for the logged-in user
            const fetchHistory = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/HistoryList/`, {
                        headers: getAuthHeaders()
                    });
                    setHistory(response.data); // Store the filtered history data returned by server
                } catch (error) {
                    console.error('Error fetching history:', error);
                    setError('Failed to fetch purchase history.'); // Set error message if failed
                }
            };

            fetchHistory();
        } else {
            setError('User is not logged in. Please log in to view your history.');
            navigate('/');
        }
    }, [user, navigate, getAuthHeaders]);

    return (
        <div className="history-container">
            <h2>Purchase History</h2>
            {error && <p className="error-message">{error}</p>}
            {history.length > 0 ? (
                <div className="receipt-grid">
                    {history.map((item, index) => (
                        <div key={index} className="receipt-card animate-card" style={{ animationDelay: `${index * 40}ms` }}>
                            <div className="receipt-header">
                                <span className="receipt-badge">SUCCESSFUL ORDER</span>
                                <span className="receipt-date">Receipt #{index + 1001}</span>
                            </div>
                            <div className="receipt-body">
                                <h3 className="receipt-item-name">{item.item_name}</h3>
                                <div className="receipt-details">
                                    <span>Price: ₹{item.item_price}</span>
                                    <span>Quantity: {item.quantity}</span>
                                </div>
                            </div>
                            <div className="receipt-footer">
                                <span className="receipt-total-label">Total Paid:</span>
                                <span className="receipt-total-value">₹{item.item_price * item.quantity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontWeight: '500' }}>
                    No purchase history found.
                </p>
            )}
        </div>
    );
};

export default History;
