import React from 'react';
import { useMenuStore } from '../../data/store';
import './Homepage.css'; 
import SearchBar from '../search/Search'

const Homepage = () => {

    const toysList = useMenuStore(state => state.filteredToysList) // tar ut filteredToysList från store
    const addToCart = useMenuStore(state => state.addToCart) // tar ut addToCart från store

    const handleAddToCart = (toyId) => { 
      addToCart(toyId)
      console.log('Added toy with id', toyId, 'to cart') // loggar till konsolen ifall en leksak har lagts till i varukorgen
    }

    return (
      <div className="vintage-toy-container">
        {/* <SearchBar /> */}
        <div className="vintage-toy-grid">
          {toysList && toysList.length > 0 ? ( // kollar ifall toylist inte är tom
            toysList.map((toy) => ( 
              <div key={toy.id} className="vintage-toy-card">
                <div className="vintage-toy-image-wrapper">
                  <img 
                    src={toy.imgLink || '/placeholder-toy.jpg'} // sätter en placeholder ifall ingen bild finns
                  // alt={toy.name} 
                    alt={toy.name || 'Vintage toy'} 
                    className="vintage-toy-image"
                  />
                </div>
                
                <div className="vintage-toy-info-header">
                  <h2 className="vintage-toy-name">{toy.name}</h2>
                  {/* <p className="vintage-toy-era">From: {toy.era}</p> */}
                </div>
                <p className="vintage-toy-price">Price: {toy.price} kr</p>
                <p className="vintage-toy-era">Era: {toy.era}</p>
                <p className="vintage-toy-description">{toy.description}</p>
                
                <button 
                  className="vintage-toy-add-button"
                  onClick={() => handleAddToCart(toy.id)} // lägger till en funktion för att lägga till i varukorg 
                  aria-label={`Add ${toy.name} to cart`}
                >
                  Add To Cart
                </button>
              </div>
            ))
          ) : (
            <div className="vintage-toy-empty-message">
              <p>No toys found.</p>
            </div>
          )}
        </div>
      </div>
    )
}

export default Homepage