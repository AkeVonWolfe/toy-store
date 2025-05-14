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

    // Find the toy objects that correspond to the IDs in the cart
    const getCartProducts = () => {
        // Count occurrences of each toy ID
        const countMap = {};
        cartItems.forEach(id => {
            countMap[id] = (countMap[id] || 0) + 1;
        })
        
        // Create array with toy details and quantities
        const uniqueItems = [...new Set(cartItems)]
        return uniqueItems.map(id => {
            const toy = toysList.find(toy => toy.id === id);
            return {
                ...toy,
                quantity: countMap[id]
            };
        }).filter(item => item); // Remove any undefined items
    }
    
    const cartProducts = getCartProducts();
    
    // Calculate total price
    const calculateTotal = () => {
        return cartProducts.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0)
    }
    
    // Handle quantity changes
    const increaseQuantity = (toyId) => {
        const addToCart = useMenuStore.getState().addToCart;
        addToCart(toyId);
    }
    
    const decreaseQuantity = (toyId) => {
        // Implementation would require adding removeFromCart to the store
        console.log("Decrease quantity for", toyId);
    }
    
    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    
    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Processing purchase:", formData);
        console.log("Items:", cartProducts);
    }

    return (
        <div className="cart-container">
            <div className="cart-content">
                <div className="checkout-form">
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
                </div>
                
                <div className="cart-items">
                    {cartProducts.length > 0 ? (
                        <>
                            {cartProducts.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.imageUrl || '/placeholder-toy.jpg'} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-price">Price {item.price}</div>
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
                                <span className="total-amount">{calculateTotal()}</span>
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