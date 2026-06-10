import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './menu.css';
import { CartContext } from '../cart/CartContext'; 
import { API_BASE_URL } from '../config';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useContext(CartContext); 

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/menu/`);
                setMenuItems(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            return menuItems; // If no search query, return all menu items
        }
        return menuItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredMenuItems = handleSearch();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading menu items: {error.message}</div>;

    return (
        <div>
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
                    <div>No menu items found.</div>
                )}
            </div>
        </div>
    );
};

export default Menu;
