import { useState } from 'react';
import { create } from 'zustand';

export const useMenuStore = create((set) => ({
    storeToysList: [],
    cartItems: [],
    filteredList: [],

    setToyList: (firebaseList) => set(() => ({ 
        storeToysList: firebaseList,
        filteredToysList: firebaseList // startar med att sätta filteredToysList till samma som storeToysList
    })),

    // Set filtered toys based on search
    setFilteredToys: (filteredList) => set(() => ({ 
        filteredToysList: filteredList 
    })),


     // lägg till en leksak i varukorgen
    addToCart: (toyId) => set((state) => ({ 
        cartItems: [...state.cartItems, toyId] 
    })),
    
    // ta bort en leksak från varukorgen
    removeFromCart: (toyId) => set((state) => {
        const index = state.cartItems.indexOf(toyId);
        if (index === -1) return state; // Item not found
        
        const newCartItems = [...state.cartItems];
        newCartItems.splice(index, 1);
        return { cartItems: newCartItems };
    }),
    
    // rensa varukorgen
    clearCart: () => set(() => ({ cartItems: [] })),
}));



