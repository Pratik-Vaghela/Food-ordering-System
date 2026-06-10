import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './navbar/navbar';
import Footer from './footer/Footer';
import UserForm from './signup/signin';
import RestaurantCards from './restaurants/RestaurantCards';
import Menu from './menu/menu';
import LoginForm from './login/LoginForm';
import Cart from './cart/Cart';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './cart/CartContext'; 
import Payment from './cart/Payment';
import History from './history/history';

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <CartProvider>
                    <Router>
                        
                        <Routes>
                            <Route path='/signin' element={<><Navbar /><UserForm /><Footer /></>} />
                            <Route path='/' element={<><Navbar /><RestaurantCards /><Footer /></>} />
                            <Route path='/menu' element={<><Navbar /><Menu /><Footer /></>} />
                            <Route path="/login" element={<><Navbar /><LoginForm /><Footer/></>} />
                            <Route path="/cart" element={<><Navbar /><Cart/><Footer/></>} />
                            <Route path="/payment" element={<><Navbar /><Payment /><Footer/></>} /> 
                            <Route path="/history" element={<><Navbar/><History/><Footer/></>}/>
                        </Routes>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
