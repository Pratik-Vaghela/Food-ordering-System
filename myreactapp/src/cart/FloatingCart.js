import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import './FloatingCart.css';

const FloatingCart = () => {
    const { cartItems, cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Do not show the floating cart on the cart or payment pages, or if the cart is empty
    if (cartCount === 0 || location.pathname === '/cart' || location.pathname === '/payment') {
        return null;
    }

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="floating-cart-banner-wrapper">
            <div className="floating-cart-banner animate-slide-up" onClick={() => navigate('/cart')}>
                <div className="floating-cart-left">
                    <div className="floating-cart-icon-wrapper">
                        <FiShoppingCart className="floating-cart-icon" />
                        <span className="floating-cart-count">{cartCount}</span>
                    </div>
                    <div className="floating-cart-total">
                        <span className="total-label">Subtotal:</span>
                        <span className="total-value">₹{cartTotal}</span>
                    </div>
                </div>
                <div className="floating-cart-right">
                    <span>View Cart</span>
                    <FiArrowRight className="floating-cart-arrow" />
                </div>
            </div>
        </div>
    );
};

export default FloatingCart;
