import React, { createContext, useState } from 'react';
export const CartContext = createContext();

// Provide CartContext to components
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
   

    const addToCart = (item, quantity = 1) => {
        const itemExists = cartItems.find(cartItem => cartItem.id === item.id);

        if (itemExists) {
            // Update quantity if item already exists
            const updatedCart = cartItems.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            );
            setCartItems(updatedCart);
        } else {
            // Add new item to cart
            setCartItems([...cartItems, { ...item, quantity }]);
        }

        // Update cart count
        setCartCount(cartCount + quantity);
    };
    const clearCart = () => {
        setCartItems([]);
    };
    const  clearCount=()=>{
        setCartCount(0);
    }

    return (
        <CartContext.Provider value={{ cartItems,clearCart,cartCount,clearCount, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
