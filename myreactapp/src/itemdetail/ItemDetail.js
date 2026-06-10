import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './itemDetail.css';
import { API_BASE_URL } from '../config';

const ItemDetail = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [menuItems, setMenuItems] = useState([]); // State for all menu items
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/menu/`); // Fetch all items
                setMenuItems(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    useEffect(() => {
        if (menuItems.length > 0) {
            const foundItem = menuItems.find(item => item.id === parseInt(id)); // Find item by ID
            setItem(foundItem || null); // Set item or null if not found
        }
    }, [menuItems, id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading items: {error.message}</div>;
    if (!item) return <div>Item not found</div>; // Handle item not found

    return (
        <div className="item-detail-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <h2>{item.name}</h2>
            <p className="item-description">{item.description}</p>
            <p className="price">₹{item.price.toFixed(2)}</p>
            <button className="add-to-cart">
                Add to Cart
            </button>
        </div>
    );
};

export default ItemDetail;
