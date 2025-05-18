import React, { useState } from 'react';
import { useMenuStore } from '../../data/store';
import './Cart.css';
import mastercard from '../../assets/mastercard.png';
import visa from '../../assets/visa.png';
import klarna from '../../assets/klarna.png';

function Cart() {
    const cartItems = useMenuStore(state => state.cartItems)
    const toysList = useMenuStore(state => state.storeToysList)
    
    // State for form inputs
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        zipCode: '',
        city: '',
        cardNumber: '',
        expiration: '',
        security: ''
    })

    // tar toyobject med hjälp av id
    const getCartProducts = () => {
        // ränkar varje id 
        const countMap = {};
        cartItems.forEach(id => {
            countMap[id] = (countMap[id] || 0) + 1;
        })
        
        // skapar en array med unika leksaks-id:n
        const uniqueItems = [...new Set(cartItems)]
        return uniqueItems.map(id => {
            const toy = toysList.find(toy => toy.id === id);
            return {
                ...toy,
                quantity: countMap[id]
            };
        }).filter(item => item); // ta bort undefined items
    }
    
    const cartProducts = getCartProducts();
    
    // kaluklerar totalpriset
    const calculateTotal = () => {
        return cartProducts.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0)
    }
    
    // lägger till en leksak i varukorgen
    const increaseQuantity = (toyId) => {
        const addToCart = useMenuStore.getState().addToCart;
        addToCart(toyId);
    }
    
    const decreaseQuantity = (toyId) => {
        const removeFromCart = useMenuStore.getState().removeFromCart;
        removeFromCart(toyId);
    }
    
    // ändrigar i inputfält
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Processing purchase:", formData);
        console.log("Items:", cartProducts);
    }

    return (
        <div className="cart-container">
            <div className="cart-content">
                {/* <div className="checkout-form">
                    <div className="payment-methods">
                        <div className="payment-option">
                            <img src={mastercard.png} alt="Mastercard" className="payment-logo" />
                        </div>
                        <div className="payment-option">
                            <img src={visa.png} alt="Visa" className="payment-logo" />
                        </div>
                        <div className="payment-option">
                            <img src={klarna.png} alt="Klarna" className="payment-logo" />
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <div className="name-inputs">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <div className="city-inputs">
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip Code"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="Card Number"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <div className="card-details">
                            <input
                                type="text"
                                name="expiration"
                                placeholder="Expiration"
                                value={formData.expiration}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="security"
                                placeholder="Security"
                                value={formData.security}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="purchase-btn">Purchase</button>
                    </form>
                </div> */}
                
                <div className="cart-items">
                    {cartProducts.length > 0 ? (
                        <>
                            {cartProducts.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.imgLink || '/placeholder-toy.jpg'} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-price"> {item.price} SEK</div>
                                    </div>
                                    <div className="quantity-controls">
                                        <button 
                                            className="quantity-btn increase" 
                                            onClick={() => increaseQuantity(item.id)}
                                        >
                                            +
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button 
                                            className="quantity-btn decrease" 
                                            onClick={() => decreaseQuantity(item.id)}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="cart-total">
                                <span className="total-label">Total Price</span>
                                <span className="total-amount">{calculateTotal()} SEK</span>
                            </div>
                        </>
                    ) : (
                        <div className="empty-cart">
                            <p>Your cart is empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart