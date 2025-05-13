import React from 'react';
import { useMenuStore } from '../../data/store';

function Cart() {

    const cartItems = useMenuStore(state => state.cartItems) // tar ut cartItems från store
    

    return <> 
    </>

}

export default Cart