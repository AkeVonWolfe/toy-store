import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from "../../assets/logo.png"
import shopping_cart from "../../assets/shopping_cart.png"
import Padlock_close from "../../assets/Padlock_close.png"

const Header = () => {

    return (
    <header className="header">
            <nav className="header-nav">
                <Link to="/admin" className="nav-item user-profile">
                    <div className="profile-icon">
                        <img src={Padlock_close} alt="User Profile" />
                    </div>
                </Link>

                <Link to="/" className="nav-item logo">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" />
                    </div>
                </Link>

                <Link to="/cart" className={`nav-item cart }`}>
                    <div className="cart-icon">
                        <img src={shopping_cart} alt="Shopping Cart" />
                        
                    </div>
                </Link>
            </nav>
        </header>
    );
};

export default Header;