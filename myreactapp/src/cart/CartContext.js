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
    const removeFromCart = (itemId) => {
        const item = cartItems.find(cartItem => cartItem.id === itemId);
        if (!item) return;
        setCartItems(cartItems.filter(cartItem => cartItem.id !== itemId));
        setCartCount(prev => Math.max(0, prev - item.quantity));
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        const item = cartItems.find(cartItem => cartItem.id === itemId);
        if (!item) return;
        const diff = newQuantity - item.quantity;
        setCartItems(cartItems.map(cartItem =>
            cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
        ));
        setCartCount(prev => Math.max(0, prev + diff));
    };

    const clearCart = () => {
        setCartItems([]);
    };
    const  clearCount=()=>{
        setCartCount(0);
    }

    return (
        <CartContext.Provider value={{ cartItems,clearCart,cartCount,clearCount, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
