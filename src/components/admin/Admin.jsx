import { useState } from 'react'
import { useMenuStore } from '../../data/store'
import './Admin.css'
import { deleteToy, updateToy, addToy } from '../../data/crud.js'
import Joi from 'joi'

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
  
  // State for validation errors och touched fields
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // validation schema med Joi med felmeddelanden
  const toySchema = Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.empty': 'Toy name cannot be empty',
      'string.min': 'Toy name must be at least 2 characters long',
      'any.required': 'Toy name is required'
    }).label('Name'),
    
    description: Joi.string().min(2).required().messages({
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least 2 characters long',
      'any.required': 'Description is required'
    }).label('Description'),
    
    category: Joi.string().min(2).required().messages({
      'string.empty': 'Category cannot be empty',
      'string.min': 'Category must be at least 2 characters long',
      'any.required': 'Category is required'
    }).label('Category'),
    
    price: Joi.number().positive().required().messages({
      'number.base': 'Price must be a valid number',
      'number.positive': 'Price must be greater than zero',
      'any.required': 'Price is required'
    }).label('Price'),
    
    era: Joi.string().min(2).required().messages({
      'string.empty': 'Era cannot be empty',
      'string.min': 'Era must be at least 2 characters long',
      'any.required': 'Era is required'
    }).label('Era'),
    
    imgLink: Joi.string().pattern(/^(http|https):\/\//).allow('').optional().messages({
      'string.pattern.base': 'Image URL must start with http:// or https://'
    }).label('Image URL'),
  })
  
  // valdering av hela formuläret
  const validateForm = (toy) => {
    const { error } = toySchema.validate(toy, { abortEarly: false })
    
    if (!error) {
      setErrors({})
      return true
    }
    
    const errorObj = {}
    error.details.forEach(err => {
      const field = err.path[0]
      errorObj[field] = err.message
    })
    setErrors(errorObj)
    return false
  }
  
  // Revalidate av ett fält när det ändras
  const validateField = (name, value) => {
    const fieldSchema = toySchema.extract(name)
    const { error } = fieldSchema.validate(value)
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
 
  // funktion för att editera en leksak
  const handleEditClick = (toy) => {
    setEditingToyId(toy.id)
    setEditedToy({ ...toy })
  }
  
  // funktion för att spara ändringar
  const handleSave = async () => {
    // Validate innan spara
    const validToy = { ...editedToy, price: Number(editedToy.price) }
    if (!validateForm(validToy)) {
      return
    }
    
    const updatedList = storeToysList.map(toy =>
      toy.id === editedToy.id ? validToy : toy
    )
    await updateToy(editedToy.id, validToy) // funktion för update från firebase
    setToyList(updatedList)
    setEditingToyId(null)
  }
  
  // funktion för att ta bort en leksak
  const handleDelete = async (id) => { // behövde göra om till async
    await deleteToy(id) // funktion för delete från firebase
    const updatedList = storeToysList.filter(toy => toy.id !== id)
    setToyList(updatedList)
    setEditingToyId(null)
  }

  // Funktion för att hantera inmatning i formuläret för ny leksak
  const handleNewToyChange = (event) => {
    const { name, value } = event.target
    const newValue = name === 'price' ? value : value
    
    setNewToy({ ...newToy, [name]: newValue })
    
    // makra fältet som "touched" för att visa felmeddelanden
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // valdera fältet
    validateField(name, name === 'price' ? Number(value) : value)
  }

  // Funktion för att lägga till ny leksak
  const handleAddToy = async (e) => {
    e.preventDefault()
    
    // valdiera innan submitt
    const validToy = { ...newToy, price: Number(newToy.price) }
    if (!validateForm(validToy)) {
      // markera alla fält som "touched" för att visa felmeddelanden
      const allTouched = Object.keys(newToy).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {})
      setTouched(allTouched)
      return
    }
    
    try {
      // Lägg till leksaken i Firestore och få tillbaka den med ID
      const addedToy = await addToy(validToy)
      
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
      
      // Reset touched och errors
      setTouched({})
      setErrors({})
      
      // Dölj formuläret
      setShowAddForm(false)
    } catch (error) {
      console.error('Fel vid tillägg av ny leksak:', error)
    }
  }
  
  // Check om formuläret är giltigt innan submitt
  const isFormValid = () => {
    const hasErrors = Object.keys(errors).length > 0
    
    const requiredFieldsFilled = 
      newToy.name.trim() &&
      newToy.description.trim() &&
      newToy.category.trim() &&
      newToy.era.trim() &&
      newToy.price.trim()
    
    return requiredFieldsFilled && !hasErrors
  }

  // hantera blur event för att markera fält som "touched"
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true })) // samma som kotlin prev, prev.toMutableMap().apply { this[field] = true
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
                onBlur={() => handleBlur('name')}
                required
              />
              {touched.name && errors.name && (
                <p className="error-text">{errors.name}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description*:</label>
              <textarea
                id="description"
                name="description"
                value={newToy.description}
                onChange={handleNewToyChange}
                onBlur={() => handleBlur('description')}
                rows="3"
                required
              />
              {touched.description && errors.description && (
                <p className="error-text">{errors.description}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category*:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newToy.category}
                onChange={handleNewToyChange}
                onBlur={() => handleBlur('category')}
                required
              />
              {touched.category && errors.category && (
                <p className="error-text">{errors.category}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="price">SEK*:</label>
              <input
                type="text"
                id="price"
                name="price"
                value={newToy.price}
                onChange={handleNewToyChange}
                onBlur={() => handleBlur('price')}
                required
              />
              {touched.price && errors.price && (
                <p className="error-text">{errors.price}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="era">Era*:</label>
              <input
                type="text"
                id="era"
                name="era"
                value={newToy.era}
                onChange={handleNewToyChange}
                onBlur={() => handleBlur('era')}
                required
              />
              {touched.era && errors.era && (
                <p className="error-text">{errors.era}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="imgLink">Image URL:</label>
              <input
                type="text"
                id="imgLink"
                name="imgLink"
                value={newToy.imgLink}
                onChange={handleNewToyChange}
                onBlur={() => handleBlur('imgLink')}
              />
              {touched.imgLink && errors.imgLink && (
                <p className="error-text">{errors.imgLink}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={!isFormValid()}
            >
              Lägg till
            </button>
          </form>
        </div>
      )}

    <div className="toy-grid">
      {storeToysList.map(toy => (
        <div key={toy.id} className="toy-card">
          <img src={toy.imgLink} className="toy-image" alt={toy.name} />

          {editingToyId === toy.id ? (
            <div className="edit-form">
              <input
                className="edit-input"
                value={editedToy.name}
                onChange={event => {
                  const value = event.target.value
                  setEditedToy({ ...editedToy, name: value })
                  validateField('name', value)
                }}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
              
              <input
                className="edit-input"
                value={editedToy.era}
                onChange={event => {
                  const value = event.target.value
                  setEditedToy({ ...editedToy, era: value })
                  validateField('era', value)
                }}
              />
              {errors.era && <p className="error-text">{errors.era}</p>}
              
              <input
                className="edit-input"
                value={editedToy.imgLink}
                onChange={event => {
                  const value = event.target.value
                  setEditedToy({ ...editedToy, imgLink: value })
                  validateField('imgLink', value)
                }}
              />
              {errors.imgLink && <p className="error-text">{errors.imgLink}</p>}
              
              <input
                className="edit-input"
                value={editedToy.price}
                onChange={event => {
                  const value = event.target.value
                  setEditedToy({ ...editedToy, price: value })
                  validateField('price', Number(value))
                }}
              />
              {errors.price && <p className="error-text">{errors.price}</p>}
              
              <textarea
                className="edit-textarea"  
                rows="3"
                value={editedToy.description}
                onChange={event => {
                  const value = event.target.value
                  setEditedToy({ ...editedToy, description: value })
                  validateField('description', value)
                }}
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
              
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={() => handleDelete(editedToy.id)} className="delete-button">Delete</button>
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