import { useState } from 'react'
import { useMenuStore } from '../../data/store'
import './Admin.css'
import { deleteToy, updateToy, addToy } from '../../data/crud.js'

function Admin() {
  // Zustand store 
  const { storeToysList, setToyList } = useMenuStore()
  const [editingToyId, setEditingToyId] = useState(null)
  const [editedToy, setEditedToy] = useState({})
  
  // State för att visa/dölja formuläret för att lägga till ny leksak
  const [showAddForm, setShowAddForm] = useState(false)
  
  // State för ny leksak
  const [newToy, setNewToy] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    era: '',
    imgLink: '' 
  })
 
  // funktion för att editera en leksak
  const handleEditClick = (toy) => {
    setEditingToyId(toy.id)
    setEditedToy({ ...toy })
  }
  
  // funktion för att spara ändringar
  const handleSave = async () => {
    const updatedList = storeToysList.map(toy =>
      toy.id === editedToy.id ? editedToy : toy
    )
    await updateToy(editedToy.id, editedToy) // funktion för update från firebase
    setToyList(updatedList)
    setEditingToyId(null)
  }
  
  // Function to handle the delete button click
  const handleDelete = async (id) => { // behövde göra om till async
    await deleteToy(id) // funktion för delete från firebase
    const updatedList = storeToysList.filter(toy => toy.id !== id)
    setToyList(updatedList)
    setEditingToyId(null)
  }

  // Funktion för att hantera inmatning i formuläret för ny leksak
  const handleNewToyChange = (event) => {
    const { name, value } = event.target
    setNewToy({ ...newToy, [name]: value })
  }

  // Funktion för att lägga till ny leksak
  const handleAddToy = async (e) => {
    e.preventDefault()
    
    // Validera att alla obligatoriska fält är ifyllda
    if (!newToy.name || !newToy.price || !newToy.era) {
      alert('Vänligen fyll i alla obligatoriska fält (Namn, Pris, Era)')
      return
    }
    
    try {
      // Lägg till leksaken i Firestore och få tillbaka den med ID
      const addedToy = await addToy(newToy)
      
      // Uppdatera listan med leksaker i Zustand store
      setToyList([...storeToysList, addedToy])
      
      // Återställ formuläret
      setNewToy({
        name: '',
        description: '',
        category: '',
        price: '',
        era: '',
        imgLink: ''
      })
      
      // Dölj formuläret
      setShowAddForm(false)
    } catch (error) {
      console.error('Fel vid tillägg av ny leksak:', error)
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button 
          className="add-toy-button" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Toy'}
        </button>
      </div>

      {}
      {showAddForm && (
        <div className="add-toy-form">
          <h2>Add new Toy</h2>
          <form onSubmit={handleAddToy}>
            <div className="form-group">
              <label htmlFor="name">Namn*:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newToy.name}
                onChange={handleNewToyChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newToy.description}
                onChange={handleNewToyChange}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newToy.category}
                onChange={handleNewToyChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">SEK:</label>
              <input
                type="text"
                id="price"
                name="price"
                value={newToy.price}
                onChange={handleNewToyChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="era">Era*:</label>
              <input
                type="text"
                id="era"
                name="era"
                value={newToy.era}
                onChange={handleNewToyChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="imgLink">Image URL:</label>
              <input
                type="text"
                id="imgLink"
                name="imgLink"
                value={newToy.imgLink}
                onChange={handleNewToyChange}
  />
            </div>
            
            <button type="submit" className="save-button">Lägg till</button>
          </form>
        </div>
      )}

    <div className="toy-grid">
      {storeToysList.map(toy => (
        <div key={toy.id} className="toy-card">
          <img src={toy.imgLink} className="toy-image" />

          {editingToyId === toy.id ? (
            <div className="edit-form">
              <input
                className="edit-input"
                value={editedToy.name}
                onChange={event => setEditedToy({ ...editedToy, name: event.target.value })}
              />
              <input
                className="edit-input"
                value={editedToy.era}
                onChange={event => setEditedToy({ ...editedToy, era: event.target.value })}
              />
              <input
                className="edit-input"
                value={editedToy.imgLink}
                onChange={event => setEditedToy({ ...editedToy, imgLink: event.target.value })}
              />
              <input
                className="edit-input"
                value={editedToy.price}
                onChange={event => setEditedToy({ ...editedToy, price: event.target.value })}
              />
              <textarea
                className="edit-textarea"  
                rows="3"
                value={editedToy.description}
                onChange={event => setEditedToy({ ...editedToy, description: event.target.value })}
              />
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={() => handleDelete(toy.id)} className="delete-button">Delete</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="toy-title">{toy.name}</h2>
              <p className="toy-era">From: {toy.era}</p>
              <p className="toy-price">Price: {toy.price} kr</p>
              <p className="toy-description">{toy.description}</p>
              <button onClick={() => handleEditClick(toy)} className="edit-button">Edit Item</button>
            </>
          )}
        </div>
      ))}
    </div>
    </div>
  )
}

export default Admin