import React from 'react';
import { useMenuStore } from '../../data/store';
import './CartCounter.css';

const CartCounter = () => {
  const cartItems = useMenuStore(state => state.cartItems);
  
   // kollar ifall varukorgen är tom
  if (cartItems.length === 0) {
    return null;
  }
  
  return (
    <div className="cart-counter">
      {cartItems.length}
    </div>
  );
};

export default CartCounter;