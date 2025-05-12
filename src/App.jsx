import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import sendVintageToys from './data/crud'
import Header from './components/header/Header.jsx'

function App() {
  const [count, setCount] = useState(0)
    // sendVintageToys();   function to send data to firebase
 

  return (
    <Header> </Header>
  )
}

export default App
