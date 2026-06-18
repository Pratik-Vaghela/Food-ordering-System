import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../AuthContext';
import { CartContext } from '../cart/CartContext';
import axios from 'axios'; 
import './History.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { FiCheckCircle, FiShoppingBag, FiHash, FiAward, FiDollarSign, FiClock, FiRefreshCw } from 'react-icons/fi';

const History = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const { user, getAuthHeaders } = useAuth(); 
    const { addToCart } = useContext(CartContext);
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

    const getTotalSpent = () => {
        return history.reduce((sum, item) => sum + (parseFloat(item.item_price) * item.quantity), 0);
    };

    const getFavoriteItem = () => {
        if (history.length === 0) return 'None';
        const counts = {};
        history.forEach(item => {
            counts[item.item_name] = (counts[item.item_name] || 0) + item.quantity;
        });
        let favorite = '';
        let maxCount = 0;
        Object.entries(counts).forEach(([name, count]) => {
            if (count > maxCount) {
                maxCount = count;
                favorite = name;
            }
        });
        return favorite;
    };

    const handleReorder = (item) => {
        addToCart({
            id: item.id || Math.floor(Math.random() * 10000),
            name: item.item_name,
            price: parseFloat(item.item_price)
        }, item.quantity);
        navigate('/cart');
    };

    return (
        <div className="history-page-container animate-scale-up">
            <h2 className="history-title">Order Dashboard</h2>
            {error && <p className="error-message">{error}</p>}
            
            {history.length > 0 ? (
                <div>
                    {/* Stats Banner Row */}
                    <div className="history-stats-banner">
                        <div className="stat-card">
                            <div className="stat-icon-wrapper orders">
                                <FiClock className="stat-icon" />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{history.length}</span>
                                <span className="stat-label">Total Orders</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon-wrapper spend">
                                <FiDollarSign className="stat-icon" />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">₹{Math.round(getTotalSpent())}</span>
                                <span className="stat-label">Total Spent</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon-wrapper favorite">
                                <FiAward className="stat-icon" />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value favorite-text">{getFavoriteItem()}</span>
                                <span className="stat-label">Favorite Dish</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="section-subtitle">Past Receipts</h3>
                    
                    {/* Receipts Grid */}
                    <div className="receipts-dashboard-grid">
                        {history.map((item, index) => (
                            <div key={index} className="receipt-card animate-card" style={{ animationDelay: `${index * 40}ms` }}>
                                <div className="receipt-header">
                                    <span className="receipt-badge">
                                        <FiCheckCircle className="badge-status-icon" />
                                        <span>Successful Order</span>
                                    </span>
                                    <span className="receipt-date">
                                        <FiHash className="receipt-header-icon" />
                                        <span>Receipt #{index + 1001}</span>
                                    </span>
                                </div>
                                <div className="receipt-body">
                                    <div className="receipt-item-info">
                                        <div className="receipt-item-icon-wrapper">
                                            <FiShoppingBag className="receipt-item-icon" />
                                        </div>
                                        <div className="receipt-item-meta">
                                            <h4 className="receipt-item-name">{item.item_name}</h4>
                                            <div className="receipt-details">
                                                <span className="receipt-detail-pill">Price: ₹{item.item_price}</span>
                                                <span className="receipt-detail-pill">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="receipt-footer">
                                    <div className="receipt-total-block">
                                        <span className="receipt-total-label">Total Paid:</span>
                                        <span className="receipt-total-value">₹{item.item_price * item.quantity}</span>
                                    </div>
                                    <button 
                                        className="reorder-btn" 
                                        onClick={() => handleReorder(item)}
                                        aria-label="Reorder this dish"
                                    >
                                        <FiRefreshCw className="reorder-btn-icon" />
                                        <span>Reorder</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="empty-history-state">
                    <FiShoppingBag className="empty-history-icon" />
                    <h3>No Order History</h3>
                    <p>You haven't ordered any delicious food yet! Your order summary will appear here once you place your first order.</p>
                    <button className="browse-restaurants-btn" onClick={() => navigate('/')}>
                        Order Food Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default History;
