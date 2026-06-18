import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './restaurants.css';
import { API_BASE_URL } from '../config';
import { FiStar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';

const RestaurantCards = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Suggestions state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch Restaurants and all Menu Items on load
    useEffect(() => {
        const fetchRestaurantsAndMenu = async () => {
            try {
                const [restaurantsRes, menuRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/restaurants/`),
                    axios.get(`${API_BASE_URL}/api/menu/`)
                ]);
                setRestaurants(restaurantsRes.data);
                setAllMenuItems(menuRes.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantsAndMenu();
    }, []);

    // Close suggestions dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Suggestion engine matching cuisines, restaurants, and dish names
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        
        // 1. Match Cuisines list
        const cuisinesList = ['Chinese', 'Burgers', 'Pizzas', 'Bakery', 'Sandwiches', 'Snacks', 'South Indian', 'Mexican', 'North Indian', 'Gujarati'];
        const matchedCuisines = cuisinesList
            .filter(c => c.toLowerCase().includes(query))
            .map(c => ({ type: 'cuisine', name: c }));

        // 2. Match Restaurants list
        const matchedRestaurants = restaurants
            .filter(r => r.name.toLowerCase().includes(query))
            .map(r => ({ type: 'restaurant', name: r.name, id: r.id }));

        // 3. Match Dishes list
        const matchedDishes = allMenuItems
            .filter(item => item.name.toLowerCase().includes(query))
            .map(item => ({ type: 'dish', name: item.name, restaurantId: item.restaurant }));

        // Combine and limit suggestions (e.g., max 2 cuisines, 3 restaurants, 4 dishes)
        const combined = [
            ...matchedCuisines.slice(0, 2),
            ...matchedRestaurants.slice(0, 3),
            ...matchedDishes.slice(0, 5)
        ];

        setSuggestions(combined);
    }, [searchQuery, restaurants, allMenuItems]);

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'restaurant') {
            navigate(`/restaurants/${suggestion.id}/menu`);
        } else {
            setSearchQuery(suggestion.name);
            setShowSuggestions(false);
        }
    };

    const handleSearch = () => {
        let list = restaurants;

        // Apply text search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            
            // Filter restaurants serving the queried dish, cuisine, or matching restaurant name
            list = list.filter(r => {
                const nameMatches = r.name.toLowerCase().includes(query);
                const cuisineMatches = getCuisine(r.name).toLowerCase().includes(query);
                
                const hasMatchingDish = allMenuItems.some(item => 
                    item.restaurant === r.id && item.name.toLowerCase().includes(query)
                );

                return nameMatches || cuisineMatches || hasMatchingDish;
            });
        }

        // Apply filter pill
        if (activeFilter === 'rating') {
            list = list.filter(r => r.rating >= 4.5);
        } else if (activeFilter === 'fast') {
            list = list.filter(r => {
                const minutes = parseInt(r.duration) || 40;
                return minutes <= 30;
            });
        } else if (activeFilter === 'quick') {
            const keywords = ['burger', 'pizza', 'bakery', 'snacks', 'vadapav', 'kfc', 'sandwich', 'cafe', 'fries', 'bite'];
            list = list.filter(r => 
                keywords.some(kw => r.name.toLowerCase().includes(kw))
            );
        }

        return list;
    };

    const getCuisine = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('wok') || lowerName.includes('chinese') || lowerName.includes('chow')) return 'Chinese • Noodles • Asian';
        if (lowerName.includes('burger') || lowerName.includes('king') || lowerName.includes('mcdonald')) return 'Burgers • American • Fast Food';
        if (lowerName.includes('pizza') || lowerName.includes('domino') || lowerName.includes('hut')) return 'Pizzas • Italian • Pastas';
        if (lowerName.includes('kfc') || lowerName.includes('fried') || lowerName.includes('chicken')) return 'Fried Chicken • Fast Food';
        if (lowerName.includes('bakery') || lowerName.includes('cake') || lowerName.includes('waffle')) return 'Desserts • Bakery • Bakes';
        if (lowerName.includes('subway') || lowerName.includes('sandwich')) return 'Sandwiches • Healthy • Salads';
        if (lowerName.includes('south') || lowerName.includes('dosa') || lowerName.includes('idli')) return 'South Indian • Comfort Food';
        if (lowerName.includes('gujarati') || lowerName.includes('thali') || lowerName.includes('punjabi') || lowerName.includes('bhaji') || lowerName.includes('chole')) return 'North Indian • Gujarati • Thalis';
        return 'Fast Food • Beverages • Snacks';
    };

    const filteredRestaurants = handleSearch();

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
            <div className="loader" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '5px solid #e2e8f0', borderTop: '5px solid #ff5200', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '600' }}>Loading delicious restaurants...</p>
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
            <h3>Error loading restaurants</h3>
            <p>{error.message || "Please try again later."}</p>
        </div>
    );

    return (
        <div className="homepage-container">
            {/* SaaS Style Hero Banner */}
            <div className="homepage-hero-banner">
                <div className="hero-content animate-scale-in">
                    <h1>Craving Something Delicious?</h1>
                    <p>Discover the best food and drinks near you.</p>
                    <div className="search-container-relative" ref={dropdownRef}>
                        <div className="search-bar-integrated">
                            <FiSearch className="search-input-icon" />
                            <input
                                type="text"
                                placeholder="Search for restaurants, cuisines or dishes..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                        </div>

                        {/* Universal Search Suggestions Box */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-dropdown-box animate-scale-in">
                                {suggestions.map((sug, idx) => (
                                    <div 
                                        key={idx} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(sug)}
                                    >
                                        <div className="suggestion-details">
                                            <span className="suggestion-name">{sug.name}</span>
                                        </div>
                                        <span className={`suggestion-badge ${sug.type}`}>
                                            {sug.type === 'cuisine' ? '🍕 Cuisine' : sug.type === 'restaurant' ? '🏪 Restaurant' : '🍔 Dish'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Pills Bar */}
            <div className="filter-pills-bar animate-fade-in">
                <button 
                    className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All
                </button>
                <button 
                    className={`filter-pill ${activeFilter === 'rating' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('rating')}
                >
                    ⭐ Top Rated (4.5+)
                </button>
                <button 
                    className={`filter-pill ${activeFilter === 'fast' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('fast')}
                >
                    🕒 Fast Delivery (≤ 30 min)
                </button>
                <button 
                    className={`filter-pill ${activeFilter === 'quick' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('quick')}
                >
                    🍔 Quick Bites
                </button>
            </div>

            <div className="restaurant-cards animate-fade-in">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant, index) => (
                        <Link 
                            to={`/restaurants/${restaurant.id}/menu`} 
                            key={restaurant.id} 
                            className="card-link"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <div className="card animate-card">
                                <div className="card-img-wrapper">
                                    <img src={restaurant.image} alt={restaurant.name} />
                                </div>
                                <div className="card-info">
                                    <h2>{restaurant.name}</h2>
                                    <p className="cuisine-tag">{getCuisine(restaurant.name)}</p>
                                    <div className="card-rating-row">
                                        <span className="rating-badge">
                                            <FiStar className="badge-icon-star" />
                                            <span>{restaurant.rating}</span>
                                        </span>
                                        <span className="duration-tag">
                                            <FiClock className="badge-icon" />
                                            <span>{restaurant.duration}</span>
                                        </span>
                                    </div>
                                    <p className="location-tag">
                                        <FiMapPin className="badge-icon" />
                                        <span>{restaurant.location}</span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', padding: '48px', fontSize: '18px', fontWeight: '600' }}>
                        No restaurants found matching your selection.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantCards;
