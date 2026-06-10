import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../cart/CartContext';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './payment.css'; 
import { API_BASE_URL } from '../config';

const Payment = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart, clearCount } = useContext(CartContext);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false); // State to manage loading

    const handlePayNow = async () => {
        const confirmPayment = window.confirm("Do you want to pay now?");
        
        if (confirmPayment) {
            setLoading(true); // Start loading
            try {
                if (user) {
                    const payload = {
                        user: user.username,
                        items: cartItems.map(item => ({
                            item_name: item.name,
                            item_price: item.price,
                            quantity: item.quantity
                        }))
                    };

                    const response = await axios.post(`${API_BASE_URL}/api/cart/`, payload);

                    // Clear the cart items
                    clearCart();
                    clearCount();
                    // Redirect to the home page
                    navigate('/');
                } else {
                    window.alert("You need to log in to complete the purchase.");
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error posting cart data:', error.response ? error.response.data : error.message);
                window.alert('Failed to process payment.');
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment Page</h2>
            <button 
                className="pay-button" 
                onClick={handlePayNow} 
                disabled={loading} // Disable button while loading
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>

            {loading && <div className="loader"></div>} {/* Display loader */}
        </div>
    );
};

export default Payment;
