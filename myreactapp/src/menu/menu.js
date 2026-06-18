import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './menu.css';
import { CartContext } from '../cart/CartContext'; 
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import { FiStar, FiSearch, FiMessageSquare, FiBookOpen, FiCornerDownRight, FiPlus, FiMinus, FiSend, FiLoader } from 'react-icons/fi';

const Menu = () => {
    const { id } = useParams(); // Get restaurant ID from the URL
    const navigate = useNavigate();
    const { user, getAuthHeaders } = useAuth();
    const { addToCart } = useContext(CartContext); 

    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [quantities, setQuantities] = useState({}); // Keep track of quantity per item
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Tab State: 'menu' or 'reviews'
    const [activeTab, setActiveTab] = useState('menu');
    
    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

    // Fetch Restaurant Details and Menu Items
    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const [restaurantRes, menuRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/restaurants/${id}/`),
                    axios.get(`${API_BASE_URL}/api/menu/?restaurant=${id}`)
                ]);
                
                setRestaurant(restaurantRes.data);
                setMenuItems(menuRes.data);
            } catch (err) {
                console.error("Error loading menu page data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRestaurantAndMenu();
        }
    }, [id]);

    // Fetch Reviews when reviews tab is active
    useEffect(() => {
        const fetchReviews = async () => {
            if (activeTab !== 'reviews') return;
            try {
                setReviewsLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/restaurants/${id}/reviews/`);
                setReviews(response.data);
            } catch (err) {
                console.error("Error loading reviews:", err);
            } finally {
                setReviewsLoading(false);
            }
        };

        if (id && activeTab === 'reviews') {
            fetchReviews();
        }
    }, [id, activeTab]);

    const handleIncrement = (itemId) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 1) + 1
        }));
    };

    const handleDecrement = (itemId) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) - 1)
        }));
    };

    // Filter menu items by search query
    const getFilteredItems = () => {
        if (!searchQuery.trim()) {
            return menuItems;
        }
        return menuItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Group menu items into pre-defined categories
    const categorizeItems = (items) => {
        const categories = {
            'Main Course': [],
            'Appetizers & Sides': [],
            'Desserts & Bakes': [],
            'Beverages & Shakes': [],
            'Other Delights': []
        };

        items.forEach(item => {
            const name = item.name.toLowerCase();
            if (name.includes('soup') || name.includes('salad')) {
                categories['Appetizers & Sides'].push(item);
            } else if (name.includes('burger') || name.includes('whopper') || name.includes('sandwich') || name.includes('sub') || name.includes('wrap') || name.includes('taco') || name.includes('quesadilla')) {
                categories['Main Course'].push(item);
            } else if (name.includes('pizza') || name.includes('noodle') || name.includes('rice') || name.includes('gravy') || name.includes('thali') || name.includes('paratha') || name.includes('pav bhaji') || name.includes('chole bhature') || name.includes('masala') || name.includes('makhani') || name.includes('dosa') || name.includes('uttapam') || name.includes('bowl')) {
                categories['Main Course'].push(item);
            } else if (name.includes('fries') || name.includes('potato') || name.includes('rings') || name.includes('rolls') || name.includes('momos') || name.includes('pocket') || name.includes('bread') || name.includes('samosa') || name.includes('nachos') || name.includes('vada') || name.includes('idli') || name.includes('strips') || name.includes('wings')) {
                categories['Appetizers & Sides'].push(item);
            } else if (name.includes('cake') || name.includes('pastry') || name.includes('slice') || name.includes('croissant') || name.includes('waffle') || name.includes('cheesecake') || name.includes('sundae') || name.includes('ice cream') || name.includes('brownie') || name.includes('churros') || name.includes('macarons')) {
                categories['Desserts & Bakes'].push(item);
            } else if (name.includes('coffee') || name.includes('chai') || name.includes('tea') || name.includes('mojito') || name.includes('lassi') || name.includes('krushers') || name.includes('drink')) {
                categories['Beverages & Shakes'].push(item);
            } else {
                categories['Other Delights'].push(item);
            }
        });

        // Filter out empty categories
        return Object.fromEntries(Object.entries(categories).filter(([_, val]) => val.length > 0));
    };

    const filteredItems = getFilteredItems();
    const groupedItems = categorizeItems(filteredItems);

    const scrollToCategory = (categoryName) => {
        const element = document.getElementById(`category-${categoryName.replace(/\s+/g, '-')}`);
        if (element) {
            const offset = 90; // sticky header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingReview(true);
        setReviewMessage({ type: '', text: '' });

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/restaurants/${id}/reviews/`,
                {
                    rating: newRating,
                    comment: newComment
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    }
                }
            );

            if (response.status === 201) {
                setReviewMessage({ type: 'success', text: 'Thank you! Your review has been posted.' });
                setNewComment('');
                setNewRating(5);
                
                // Refresh reviews list
                const updatedResponse = await axios.get(`${API_BASE_URL}/api/restaurants/${id}/reviews/`);
                setReviews(updatedResponse.data);

                // Auto-clear message
                setTimeout(() => setReviewMessage({ type: '', text: '' }), 4000);
            }
        } catch (err) {
            console.error("Failed to post review:", err);
            setReviewMessage({ type: 'error', text: 'Failed to post review. Please try again.' });
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
            <div className="loader" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '5px solid #e2e8f0', borderTop: '5px solid #ff5200', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '600' }}>Loading delicious menu...</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', fontWeight: '600' }}>
            <h3>Error loading menu</h3>
            <p>{error.message || "Please try again later."}</p>
        </div>
    );

    return (
        <div className="menu-page-wrapper">
            {/* Restaurant Banner */}
            {restaurant && (
                <div className="restaurant-header-banner animate-scale-in">
                    <img src={restaurant.image} alt={restaurant.name} className="banner-img" />
                    <div className="banner-details">
                        <h1>{restaurant.name}</h1>
                        <p className="banner-meta">
                            <span className="rating-badge-lg">⭐ {restaurant.rating}</span>
                            <span className="meta-separator">•</span>
                            <span>{restaurant.duration}</span>
                            <span className="meta-separator">•</span>
                            <span>{restaurant.location}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Tabs */}
            <div className="menu-tabs-container">
                <button 
                    className={`menu-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
                    onClick={() => setActiveTab('menu')}
                >
                    <FiBookOpen className="tab-icon" />
                    <span>Order Online</span>
                </button>
                <button 
                    className={`menu-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    <FiMessageSquare className="tab-icon" />
                    <span>Reviews & Ratings</span>
                </button>
            </div>

            {/* TAB CONTENT: ORDER ONLINE */}
            {activeTab === 'menu' && (
                <div className="menu-content-split animate-fade-in">
                    
                    {/* Sticky Sidebar Index Panel */}
                    <div className="menu-sidebar-index">
                        <div className="sidebar-title">Categories</div>
                        <ul className="sidebar-list">
                            {Object.keys(groupedItems).map((categoryName) => (
                                <li key={categoryName} className="sidebar-item">
                                    <button onClick={() => scrollToCategory(categoryName)} className="sidebar-link">
                                        <FiCornerDownRight className="link-bullet" />
                                        <span>{categoryName}</span>
                                        <span className="count-badge">{groupedItems[categoryName].length}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Menu Items Area */}
                    <div className="menu-items-area">
                        {/* Search Bar */}
                        <div className="menu-search-wrapper">
                            <FiSearch className="search-icon-inside" />
                            <input
                                type="text"
                                placeholder="Search for dishes, starters or drinks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* List grouped items */}
                        {Object.keys(groupedItems).length > 0 ? (
                            Object.keys(groupedItems).map((categoryName) => (
                                <div 
                                    key={categoryName} 
                                    className="menu-category-section" 
                                    id={`category-${categoryName.replace(/\s+/g, '-')}`}
                                >
                                    <h2 className="category-section-title">
                                        {categoryName} 
                                        <span className="category-section-count">({groupedItems[categoryName].length})</span>
                                    </h2>
                                    <div className="menu-cards">
                                        {groupedItems[categoryName].map((item, index) => {
                                            const itemQty = quantities[item.id] || 1;
                                            return (
                                                <div key={item.id} className="card menu-card-animated">
                                                    <div className="menu-card-img-wrapper">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                    <div className="card-content">
                                                        <h2>{item.name}</h2>
                                                        <p className="price">₹{item.price}</p>

                                                        {/* Stepper Quantity Input */}
                                                        <div className="stepper-wrapper">
                                                            <span className="stepper-label">Qty:</span>
                                                            <div className="quantity-stepper">
                                                                <button 
                                                                    className="stepper-btn"
                                                                    onClick={() => handleDecrement(item.id)}
                                                                >
                                                                    <FiMinus />
                                                                </button>
                                                                <span className="stepper-value">{itemQty}</span>
                                                                <button 
                                                                    className="stepper-btn"
                                                                    onClick={() => handleIncrement(item.id)}
                                                                >
                                                                    <FiPlus />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Add to Cart Button */}
                                                        <button 
                                                            className="add-to-cart-btn"
                                                            onClick={() => addToCart(item, itemQty)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-items-placeholder">
                                No dishes matches your search.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === 'reviews' && (
                <div className="reviews-tab-content animate-fade-in">
                    
                    {/* Add Review Panel */}
                    <div className="add-review-panel">
                        <h3>Write a Review</h3>
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="review-composer-form">
                                {reviewMessage.text && (
                                    <div className={`review-alert-box ${reviewMessage.type}`}>
                                        {reviewMessage.text}
                                    </div>
                                )}
                                <div className="rating-select-group">
                                    <span className="rating-label">Rating:</span>
                                    <div className="star-picker">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                className={`star-pick-btn ${star <= newRating ? 'selected' : ''}`}
                                                onClick={() => setNewRating(star)}
                                            >
                                                <FiStar className="star-pick-icon" />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="rating-desc-text">({newRating} out of 5 stars)</span>
                                </div>

                                <div className="composer-textarea-wrapper">
                                    <textarea
                                        rows="3"
                                        placeholder="Share your experience dining or ordering from this restaurant..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="composer-submit-row">
                                    <button 
                                        type="submit" 
                                        className="submit-review-btn" 
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? (
                                            <FiLoader className="btn-spinner animate-spin" />
                                        ) : (
                                            <FiSend className="btn-icon" />
                                        )}
                                        <span>Submit Review</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="review-auth-placeholder">
                                <p>You must be logged in to post reviews and ratings.</p>
                                <button onClick={() => navigate('/login')} className="reviews-login-btn">
                                    Log In to Review
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Reviews List Panel */}
                    <div className="reviews-list-panel">
                        <h3>Customer Reviews ({reviews.length})</h3>
                        {reviewsLoading ? (
                            <div className="reviews-loader-container">
                                <FiLoader className="spinner-icon animate-spin" />
                                <p>Loading feedback...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="reviews-grid">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="review-card-item animate-fade-in">
                                        <div className="review-card-header">
                                            <div className="review-author-avatar">
                                                {rev.user ? rev.user.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="review-author-meta">
                                                <span className="author-name">@{rev.user}</span>
                                                <span className="review-date">
                                                    {new Date(rev.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="review-card-stars">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FiStar 
                                                        key={s} 
                                                        className={`review-star-icon ${s <= rev.rating ? 'active' : ''}`} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="review-card-body">
                                            <p>{rev.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-reviews-placeholder">
                                <FiMessageSquare className="no-reviews-icon" />
                                <p>No reviews yet for this restaurant. Be the first to share your experience!</p>
                            </div>
                        )}
                    </div>

                </div>
            )}

        </div>
    );
};

export default Menu;
