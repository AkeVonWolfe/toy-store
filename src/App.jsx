import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import { getFirestoreData } from './data/crud.js'
import Header from './components/header/Header.jsx'
import { useMenuStore } from './data/store.js'

function App() {
  const setToyList = useMenuStore(state => state.setToyList)
  // sendVintageToys();   function to send data to firebase
  
  useEffect(() => {
    getFirestoreData(setToyList);
  }, [setToyList]);

  return (
    <div className="app">
      <Header/>
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  )
}

export default App