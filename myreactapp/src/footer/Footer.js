import React from 'react';
import './footer.css'; 

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-text">
                <strong style={{ color: 'grey' }}>
                    For a good experience, download the Swiggy app from:
                </strong>
            </div>
            <div className="footer-links">
                <a href="https://play.google.com/store/apps/details?id=in.swiggy.android" target="_blank" rel="noopener noreferrer">
                    <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/play_store.png" alt="Google Play" className="footer-image" />
                </a>
                <a href="https://apps.apple.com/app/swiggy/id1121101800" target="_blank" rel="noopener noreferrer">
                    <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/app_store.png" alt="App Store" className="footer-image" />
                </a>
            </div>
            <div className="footer-columns">
                <div className="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li>About</li>
                        <li>Careers</li>
                        <li>TeamSwiggy One</li>
                        <li>Swiggy Instamart</li>
                        <li>Swiggy Genie</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Contact Us</h4>
                    <ul>
                        <li>Help & Support</li>
                        <li>Partner With Us</li>
                        <li>Ride With Us</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Legal</h4>
                    <ul>
                        <li>Terms and Conditions</li>
                        <li>Cookie Policy</li>
                        <li>Privacy Policy</li>
                        <li>Investor Relations</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>We Deliver To</h4>
                    <ul>
                        <li>Bangalore</li>
                        <li>Ahmedabad</li>
                        <li>Chandigarh</li>
                        <li>Mumbai</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p style={{ color: 'white' }}>
                    © 2024 Swiggy. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
