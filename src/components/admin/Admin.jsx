import { useState } from 'react';
import { useMenuStore } from '../../data/store';
import './Admin.css';
import { deleteToy, updateToy } from '../../data/crud.js'

function Admin() {

    // Zustand store 
  const { storeToysList, setToyList } = useMenuStore()
  const [editingToyId, setEditingToyId] = useState(null)
  const [editedToy, setEditedToy] = useState({})
 
// ta davids edits och remove from message example 

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
  const handleDelete  = async (id) => { // behövde göra om till async
    await deleteToy(id) // funktion för delete från firebase
    const updatedList = storeToysList.filter(toy => toy.id !== id)
    setToyList(updatedList)
    setEditingToyId(null)
  }

  return (
    <div className="toy-grid">
      {storeToysList.map(toy => (
        <div key={toy.id} className="toy-card">
          <img src={toy.image} alt={toy.name} className="toy-image" />

          {editingToyId === toy.id ? (
            <div className="edit-form">
              <input
                className="edit-input"
                value={editedToy.name}
                onChange={event => setEditedToy({ ...editedToy, name: event.target.value })}
              />
              <input
                className="edit-input"
                value={editedToy.from}
                onChange={event => setEditedToy({ ...editedToy, from: event.target.value })}
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
              <p className="toy-from">From: {toy.from}</p>
              <p className="toy-price">Price: {toy.price} kr</p>
              <p className="toy-description">{toy.description}</p>
              <button onClick={() => handleEditClick(toy)} className="edit-button">Edit Item</button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default Admin