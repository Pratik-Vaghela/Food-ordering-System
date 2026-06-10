import React, { useContext } from 'react';
import { CartContext } from './CartContext'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext'; 
import './cart.css';

const Cart = () => {
    const { cartItems } = useContext(CartContext); 
    const { user } = useAuth(); 
    const navigate = useNavigate(); 

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        if (!user) {
            // If the user is not logged in, redirect to the login page
            navigate('/login');
        } else {
            // If the user is logged in, redirect to the payment page
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
                    <button onClick={handleCheckout}>Checkout</button>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
