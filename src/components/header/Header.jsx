import { NavLink } from "react-router"
import logo from "../../assets/logo.png"
import shopping_cart from "../../assets/shopping_cart.png"

const Header = () => {
    return (
        <header>
            <nav className="header-nav">
                <NavLink>
                    {/* <img src={logo} /> */}
                </NavLink>

                <NavLink>
                    <img src={logo} />
                </NavLink>

                <NavLink>
                    <img src={shopping_cart} />
                </NavLink>


            </nav>
        </header>
    )
}

export default Header