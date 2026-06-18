import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './restaurants.css';
import { API_BASE_URL } from '../config';
import { FiStar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';

const RestaurantCards = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Pagination state (ref avoids stale-closure issues inside IntersectionObserver)
    const pageRef = useRef(1);
    const [hasMore, setHasMore] = useState(false);
    
    // Suggestions state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchSticky, setIsSearchSticky] = useState(false);
    
    const dropdownRef = useRef(null);
    const stickyDropdownRef = useRef(null);
    const observerRef = useRef(null);
    const heroRef = useRef(null);
    const navigate = useNavigate();
    
    const searchTimeoutRef = useRef(null);
    const listTimeoutRef = useRef(null);

    // Fetch restaurants from backend
    const fetchRestaurants = async (pageNum, isInitial = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);
            
            let url = `${API_BASE_URL}/api/restaurants/?page=${pageNum}`;
            if (searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }
            if (activeFilter !== 'all') {
                url += `&filter=${encodeURIComponent(activeFilter)}`;
            }
            
            const res = await axios.get(url);
            const newRestaurants = res.data.results || [];
            const nextUrl = res.data.next;
            
            if (isInitial) {
                setRestaurants(newRestaurants);
            } else {
                setRestaurants(prev => [...prev, ...newRestaurants]);
            }
            
            setHasMore(!!nextUrl);
        } catch (err) {
            console.error("Error loading restaurants list:", err);
            setError(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Reload list on search query or filter capsule updates (debounced)
    useEffect(() => {
        if (listTimeoutRef.current) {
            clearTimeout(listTimeoutRef.current);
        }

        listTimeoutRef.current = setTimeout(() => {
            pageRef.current = 1;
            fetchRestaurants(1, true);
        }, 300);

        return () => {
            if (listTimeoutRef.current) {
                clearTimeout(listTimeoutRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter, searchQuery]);

    // IntersectionObserver scroll trigger for loading subsequent pages
    useEffect(() => {
        if (loading) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loadingMore) {
                pageRef.current += 1;
                fetchRestaurants(pageRef.current, false);
            }
        }, { threshold: 1.0 });

        const currentTarget = observerRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, hasMore, loadingMore]);

    // Fetch search suggestions on search input (debounced by 300ms)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/search-suggestions/?q=${encodeURIComponent(searchQuery)}`);
                setSuggestions(res.data);
            } catch (err) {
                console.error("Error loading suggestions:", err);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    // Close suggestions dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const inHero = dropdownRef.current && dropdownRef.current.contains(event.target);
            const inSticky = stickyDropdownRef.current && stickyDropdownRef.current.contains(event.target);
            if (!inHero && !inSticky) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Sticky search bar: show when hero scrolls out of viewport
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const obs = new IntersectionObserver(
            ([entry]) => setIsSearchSticky(!entry.isIntersecting),
            { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
        );
        obs.observe(hero);
        return () => obs.unobserve(hero);
    }, []);

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'restaurant') {
            navigate(`/restaurants/${suggestion.id}/menu`);
        } else {
            setSearchQuery(suggestion.name);
            setShowSuggestions(false);
        }
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

            {/* ── Sticky Search Bar (appears when hero scrolls out of view) ── */}
            <div className={`sticky-search-bar ${isSearchSticky ? 'sticky-search-bar--visible' : ''}`}>
                <div className="sticky-search-inner" ref={stickyDropdownRef}>
                    <div className="sticky-search-field">
                        <FiSearch className="search-input-icon" style={{ color: '#ff5200' }} />
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
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="suggestions-dropdown-box animate-scale-in" style={{ top: '52px' }}>
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

            {/* SaaS Style Hero Banner */}
            <div className="homepage-hero-banner" ref={heroRef}>
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
                {restaurants.length > 0 ? (
                    restaurants.map((restaurant, index) => (
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

            {/* Infinite Scroll target observer */}
            <div ref={observerRef} style={{ height: '30px', margin: '24px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loadingMore && (
                    <div className="loader" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTop: '3px solid #ff5200', animation: 'spin 1s linear infinite' }}></div>
                )}
            </div>
        </div>
    );
};

export default RestaurantCards;
