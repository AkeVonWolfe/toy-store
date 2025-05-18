import React from 'react';
import { useMenuStore } from '../../data/store';
import './Homepage.css'; 
import SearchBar from '../search/Search'

const Homepage = () => {

    const toysList = useMenuStore(state => state.filteredToysList) // tar ut filteredToysList från store
    const addToCart = useMenuStore(state => state.addToCart) // tar ut addToCart från store

    const handleAddToCart = (toyId) => { 

      addToCart(toyId)

        console.log ('Added toy with id ', toyId, 'to cart') // loggar till konsolen ifall en leksak har lagts till i varukorgen

        // need to add functiion so it copies cartitems when adding new item
        console.log ('Current cart items: ' , addToCart.length)
    }

    return (
    <div className="toy-menu-container">
      {/* <SearchBar /> */}
      <div className="toy-grid">
        {toysList && toysList.length > 0 ? ( // kollar ifall toylist inte är tom
          toysList.map((toy) => ( 
            <div key={toy.id} className="toy-card">
              <div className="toy-image-container">
                <img 
                   src={toy.imgLink || '/placeholder-toy.jpg'} // sätter en placeholder ifall ingen bild finns
                  // alt={toy.name} 
                  className="toy-image"
                  
                />
              </div>
              
              <div className="toy-header">
                <h2 className="toy-name">{toy.name}</h2>
                {/* <p className="toy-era">From: {toy.era}</p> */}
              </div>
              <p className="toy-price">Price: {toy.price} kr</p>
              <p className="toy-description">{toy.description}</p>
              
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(toy.id)} // lägger till en funktion för att lägga till i varukorg 
              >
                Add To Cart
              </button>
            </div>
          ))
        ) : (
          <div className="no-toys-message">
            <p>No toys found.</p>
          </div>
        )}
      </div>
    </div>
  )
}


export default Homepage