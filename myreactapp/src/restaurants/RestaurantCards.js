import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './restaurants.css';
import { API_BASE_URL } from '../config';

const RestaurantCards = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/restaurants/`);
                setRestaurants(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            return restaurants; // If no search query, return all restaurants
        }
        return restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredRestaurants = handleSearch();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading restaurants: {error.message}</div>;

    return (
        <div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for a restaurant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="restaurant-cards">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                        <Link to={`/menu`} key={restaurant.id} className="card-link">
                            <div className="card">
                                <img src={restaurant.image} alt={restaurant.name} />
                                <h2>{restaurant.name}</h2>
                                <div>
                                    <p className="rating">⭐ {restaurant.rating} ● {restaurant.duration}</p>
                                </div>
                                <p>{restaurant.location}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div>No restaurants found.</div>
                )}
            </div>
        </div>
    );
};

export default RestaurantCards;
