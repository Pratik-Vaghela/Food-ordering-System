import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import './cart.css';

const Cart = () => {
    const { cartItems } = useContext(CartContext); 
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
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <div>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id}>
                                {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ₹{getTotal()}</h3>
                    
                    {showLoginWarning && !user && (
                        <div className="checkout-warning-box animate-scale-in">
                            <p className="warning-text">⚠️ You will have to log in first to check out.</p>
                            <button className="checkout-login-btn" onClick={() => navigate('/login')}>
                                Log In to Checkout
                            </button>
                        </div>
                    )}

                    <button onClick={handleCheckout}>Checkout</button>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
