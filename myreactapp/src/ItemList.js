import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const IList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/items/`);
                setItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default IList;