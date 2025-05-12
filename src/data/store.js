import { useState } from 'react';
import { create } from 'zustand';

const useMenuStore = create((set) => ({
    storeToysList: [],

    setToyList: (firebaseList) => set(() => ({ storeToysList: firebaseList }))
}));