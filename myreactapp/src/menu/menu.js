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
            <div className="loader" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '5px solid #f3f3f3', borderTop: '5px solid #FF5733', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#7f8c8d', fontSize: '18px', fontWeight: '500' }}>Loading delicious menu...</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#c0392b', fontWeight: '500' }}>
            <h3>Error loading menu</h3>
            <p>{error.message || "Please try again later."}</p>
        </div>
    );

    return (
        <div>
            {restaurant && (
                <div className="restaurant-header-banner">
                    <img src={restaurant.image} alt={restaurant.name} className="banner-img" />
                    <div className="banner-details">
                        <h1>{restaurant.name}</h1>
                        <p className="banner-meta">⭐ {restaurant.rating} ● {restaurant.duration} ● {restaurant.location}</p>
                    </div>
                </div>
            )}

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for a menu item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            
            <div className="menu-cards">
                {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map(item => (
                        <div key={item.id} className="card">
                            <img src={item.image} alt={item.name} />
                            <div className="card-content">
                                <h2>{item.name}</h2>
                                <p className="price">₹{item.price}</p>

                                {/* Quantity Input */}
                                <label htmlFor={`quantity-${item.id}`}>Quantity: </label>
                                <input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    onChange={(e) => item.quantity = parseInt(e.target.value)}
                                />

                                {/* Add to Cart Button */}
                                <button onClick={() => addToCart(item, item.quantity || 1)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#7f8c8d', padding: '40px', fontSize: '18px', fontWeight: '500' }}>
                        No menu items found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
