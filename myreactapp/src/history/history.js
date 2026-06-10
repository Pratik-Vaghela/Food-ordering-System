import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios'; 
import './History.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const History = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const { user } = useAuth(); 
    const navigate = useNavigate();
    useEffect(() => {
        // Check if the user is logged in
        if (user && user.username) {
            // Fetch the history for the logged-in user
            const fetchHistory = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/HistoryList/`);
                    const allHistory = response.data;

                    // Filter history based on the logged-in user's username
                    const userHistory = allHistory.filter(item => item.user_name === user.username);

                    setHistory(userHistory); // Store the filtered history data
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
    }, [user, navigate]);

    return (
        <div className="history-container">
            <h2>Purchase History</h2>
            {error && <p className="error-message">{error}</p>}
            {history.length > 0 ? (
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>
                            {item.item_name} - ₹{item.item_price} x {item.quantity} = ₹{item.item_price * item.quantity}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No purchase history found.</p>
            )}
        </div>
    );
};

export default History;
