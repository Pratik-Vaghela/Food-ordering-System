import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './menu.css';
import { CartContext } from '../cart/CartContext'; 
import { API_BASE_URL } from '../config';

const Menu = () => {
    const { id } = useParams(); // Get restaurant ID from the URL
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [quantities, setQuantities] = useState({}); // Keep track of quantity per item in React state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useContext(CartContext); 

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch both restaurant details and menu items associated with this restaurant
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

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            return menuItems; // If no search query, return all menu items
        }
        return menuItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredMenuItems = handleSearch();

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

            <div className="search-bar animate-fade-in" style={{ animationDelay: '100ms' }}>
                <input
                    type="text"
                    placeholder="Search for a menu item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            
            <div className="menu-cards animate-fade-in" style={{ animationDelay: '150ms' }}>
                {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((item, index) => {
                        const itemQty = quantities[item.id] || 1;
                        return (
                            <div 
                                key={item.id} 
                                className="card menu-card-animated"
                                style={{ animationDelay: `${index * 50}ms`, opacity: 0, animation: 'cardFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                            >
                                <div className="menu-card-img-wrapper">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="card-content">
                                    <h2>{item.name}</h2>
                                    <p className="price">₹{item.price}</p>

                                    {/* Premium Stepper Quantity Input */}
                                    <div className="stepper-wrapper">
                                        <span className="stepper-label">Quantity:</span>
                                        <div className="quantity-stepper">
                                            <button 
                                                className="stepper-btn"
                                                onClick={() => handleDecrement(item.id)}
                                            >
                                                -
                                            </button>
                                            <span className="stepper-value">{itemQty}</span>
                                            <button 
                                                className="stepper-btn"
                                                onClick={() => handleIncrement(item.id)}
                                            >
                                                +
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
                    })
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: '48px', fontSize: '18px', fontWeight: '600' }}>
                        No menu items found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
