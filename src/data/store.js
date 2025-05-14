import { useState } from 'react';
import { create } from 'zustand';

export const useMenuStore = create((set) => ({
    storeToysList: [],
    cartItems: [],

    setToyList: (firebaseList) => set(() => ({ storeToysList: firebaseList })),


     // Add item to cart
    addToCart: (toyId) => set((state) => ({ 
        cartItems: [...state.cartItems, toyId] 
    })),
    
    // Remove item from cart
    removeFromCart: (toyId) => set((state) => {
        const index = state.cartItems.indexOf(toyId);
        if (index === -1) return state; // Item not found
        
        const newCartItems = [...state.cartItems];
        newCartItems.splice(index, 1);
        return { cartItems: newCartItems };
    }),
    
    // Clear the entire cart
    clearCart: () => set(() => ({ cartItems: [] })),
}));



