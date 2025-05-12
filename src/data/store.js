import { useState } from 'react';
import { create } from 'zustand';

export const useMenuStore = create((set) => ({
    storeToysList: [],
    cartItems: [],

    setToyList: (firebaseList) => set(() => ({ storeToysList: firebaseList }))
}));

