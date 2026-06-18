import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiInfo } from 'react-icons/fi';
import './cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext); 
    const { user } = useAuth(); 
    const navigate = useNavigate(); 
    const [showLoginWarning, setShowLoginWarning] = useState(false);

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        if (!user) {
            setShowLoginWarning(true);
        } else {
            navigate('/payment'); 
        }
    };

    return (
        <div className="cart-page-container animate-scale-up">
            <h2 className="cart-title">Your Cart</h2>
            {cartItems.length > 0 ? (
                <div className="cart-grid-layout">
                    {/* Left Column: Items */}
                    <div className="cart-items-column">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item-card">
                                <div className="cart-item-info">
                                    <div className="cart-item-image-wrapper">
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="cart-item-img" 
                                                onError={(e) => { e.target.style.display = 'none'; }} 
                                            />
                                        ) : null}
                                        <FiShoppingBag className="cart-item-fallback-icon" />
                                    </div>
                                    <div className="cart-item-details">
                                        <span className="cart-item-name">{item.name}</span>
                                        <span className="cart-item-price">₹{item.price} each</span>
                                    </div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="cart-item-stepper">
                                        <button 
                                            className="cart-stepper-btn" 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            aria-label="Decrease quantity"
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="cart-stepper-value">{item.quantity}</span>
                                        <button 
                                            className="cart-stepper-btn" 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            aria-label="Increase quantity"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                    <span className="cart-item-total">₹{item.price * item.quantity}</span>
                                    <button 
                                        className="cart-item-delete" 
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="cart-summary-column">
                        <div className="summary-sticky-card">
                            <h3>Order Summary</h3>
                            <div className="summary-details">
                                <div className="summary-detail-row">
                                    <span className="detail-label">Subtotal</span>
                                    <span className="detail-value">₹{getTotal()}</span>
                                </div>
                                <div className="summary-detail-row">
                                    <span className="detail-label">Taxes & Fees (5%)</span>
                                    <span className="detail-value">₹{Math.round(getTotal() * 0.05)}</span>
                                </div>
                                <div className="summary-detail-row">
                                    <span className="detail-label">Delivery Charge</span>
                                    <span className="detail-value">
                                        {getTotal() >= 500 ? (
                                            <span className="free-delivery-badge">FREE</span>
                                        ) : (
                                            "₹40"
                                        )}
                                    </span>
                                </div>
                                
                                {getTotal() < 500 && (
                                    <div className="free-delivery-tip">
                                        <FiInfo className="tip-icon" />
                                        <span>Add <strong>₹{500 - getTotal()}</strong> more for <strong>FREE Delivery!</strong></span>
                                    </div>
                                )}
                            </div>

                            <div className="summary-divider"></div>
                            
                            <div className="summary-total-row">
                                <span className="total-label">Grand Total</span>
                                <span className="total-value">
                                    ₹{getTotal() + Math.round(getTotal() * 0.05) + (getTotal() >= 500 ? 0 : 40)}
                                </span>
                            </div>

                            {showLoginWarning && !user && (
                                <div className="checkout-warning-box animate-scale-in">
                                    <p className="warning-text">⚠️ You will have to log in first to check out.</p>
                                    <button className="checkout-login-btn" onClick={() => navigate('/login')}>
                                        Log In to Checkout
                                    </button>
                                </div>
                            )}

                            <button className="checkout-btn-main" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-cart-state animate-scale-up">
                    <FiShoppingBag className="empty-cart-icon" />
                    <h3>Your cart is empty</h3>
                    <p>Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
                    <button className="browse-restaurants-btn" onClick={() => navigate('/')}>
                        Browse Restaurants
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
