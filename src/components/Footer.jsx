import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiSend } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🎬</span>
                        <span className="logo-text">CineVerse</span>
                    </Link>
                    <p>
                        Your ultimate destination for discovering movies, TV shows, and anime.
                        Stream your favorites and stay updated with the latest in cinema.
                    </p>
                    <div className="footer-social">
                        <a href="https://github.com/abhishekkalme" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FiGithub />
                        </a>
                        <a href="#" className="social-icon">
                            <FiTwitter />
                        </a>
                        <a href="#" className="social-icon">
                            <FiInstagram />
                        </a>
                        <a href="mailto:contact@cineverse.com" className="social-icon">
                            <FiMail />
                        </a>
                    </div>
                </div>

                <div className="footer-links-group">
                    <div className="footer-section">
                        <h4>Explore</h4>
                        <ul className="footer-links">
                            <li><Link to="/movies">Movies</Link></li>
                            <li><Link to="/tv">TV Shows</Link></li>
                            <li><Link to="/anime">Anime</Link></li>
                            <li><Link to="/platform">Platforms</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Community</h4>
                        <ul className="footer-links">
                            <li><Link to="/community">Discussions</Link></li>
                            <li><Link to="/profile">My Watchlist</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/discovery/movie/top_rated/Top%20Rated">Top Rated</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Stay Updated</h4>
                    <div className="newsletter-box">
                        <p>Subscribe to get the latest cinema news and updates.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Email address" required />
                            <button type="submit" className="newsletter-btn">
                                <FiSend />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} CineVerse. All rights reserved.</p>
                <div className="footer-bottom-links">
                    <Link to="/terms">Privacy Policy</Link>
                    <Link to="/terms">Terms of Use</Link>
                    <Link to="/community">Support</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
