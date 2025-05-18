import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import { getFirestoreData, sendVintageToys } from './data/crud.js'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/footer.jsx'
import { useMenuStore } from './data/store.js'


function App() {
  const setToyList = useMenuStore(state => state.setToyList)
  //sendVintageToys();   //function to send data to firebase
  

  // behöver inte skicka data till firebase varje gång appen laddas
  useEffect(() => {
    getFirestoreData(setToyList);
  }, []); // tom array körs bara en gång så att jag inte läser 1.3k 

  return (
    <div className="app">
      <Header/>
      <main className="main-content">
        <Outlet /> 
      </main>
      <Footer/>
    </div>
  )
}

export default App