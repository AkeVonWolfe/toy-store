import { use, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getFirestoreData, sendVintageToys } from './data/crud.js'
import Header from './components/header/Header.jsx'
import { useMenuStore } from './data/store.js'
import Homepage from './components/Home/Homepage.jsx'




function App() {
  const setToyList = useMenuStore(state => state.setToyList)
    // sendVintageToys();   function to send data to firebase
    
    useEffect(() => {
    getFirestoreData(setToyList);
  }, [setToyList]);

 

  return (
    <>
    <Header />
    <Homepage />
    
    </>
  )
}

export default App
