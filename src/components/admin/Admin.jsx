import { useState, useEffect } from 'react'
import { useMenuStore } from '../../data/store'
import './Admin.css'
import { deleteToy, updateToy, addToy } from '../../data/crud.js'
import Joi from 'joi'

function Admin() {
  // Zustand store 
  const { storeToysList, setToyList } = useMenuStore()
  const [editingToyId, setEditingToyId] = useState(null)
  const [editedToy, setEditedToy] = useState({})
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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

  // Clear success message after 3 seconds
  useEffect(() => {
    let timer;
    if (saveSuccess) {
      timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [saveSuccess])

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
    console.log("Validating toy:", toy);
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
    console.log("Validation errors:", errorObj);
    setErrors(errorObj)
    return false
  }
  
  // Revalidate av ett fält när det ändras
  const validateField = (name, value) => {
    try {
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
    } catch (err) {
      console.error(`Error validating field ${name}:`, err);
    }
  }
 
  // funktion för att editera en leksak
  const handleEditClick = (toy) => {
    setSaveSuccess(false)
    setSaveError(null)
    setEditingToyId(toy.id)
    
    // Se till att copy leksaksobjektet ordentligt
      const toyToEdit = { ...toy }
    
    // kollar alla fält och sätter tomma strängar om de är undefined
    const completeEditedToy = {
      id: toy.id,
      name: toyToEdit.name || '',
      description: toyToEdit.description || '',
      category: toyToEdit.category || '',
      era: toyToEdit.era || '',
      price: toyToEdit.price || 0,
      imgLink: toyToEdit.imgLink || ''
    }
    
    setEditedToy(completeEditedToy)
    
    // nollställ errors och touched states när redigering påbörjas
    setErrors({})
    setTouched({})
  }
  
  // funktion för att spara ändringar
  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      setSaveError(null)
      setSaveSuccess(false)
      console.log("Starting save operation for toy:", editedToy)
      
      // Explicitly convert price to number
      let parsedPrice = 0
      try {
        parsedPrice = Number(editedToy.price)
        // Check if the conversion resulted in a valid number
        if (isNaN(parsedPrice)) {
          setErrors(prev => ({ ...prev, price: "Price must be a valid number" }))
          setTouched(prev => ({ ...prev, price: true }))
          console.error("Price conversion failed:", editedToy.price)
          setIsSubmitting(false)
          return
        }
      } catch (e) {
        console.error("Error parsing price:", e)
        setErrors(prev => ({ ...prev, price: "Price must be a valid number" }))
        setTouched(prev => ({ ...prev, price: true }))
        setIsSubmitting(false)
        return
      }
      
      // Create a clean object for validation and saving
      const toyToSave = {
        name: editedToy.name?.trim() || "",
        description: editedToy.description?.trim() || "",
        category: editedToy.category?.trim() || "",
        era: editedToy.era?.trim() || "",
        price: parsedPrice,
        imgLink: editedToy.imgLink?.trim() || ""
      }
      
      console.log("Prepared toy for validation:", toyToSave)
      
      // Mark all fields as touched to show any validation errors
      const allTouched = {
        name: true,
        description: true,
        category: true,
        era: true,
        price: true,
        imgLink: true
      }
      setTouched(allTouched)
      
      // Validate before saving
      if (!validateForm(toyToSave)) {
        console.error("Validation failed with errors:", errors)
        setIsSubmitting(false)
        return // Don't proceed if validation fails
      }
      
      console.log("Validation passed, updating toy with ID:", editedToy.id)
      console.log("Data being sent to Firebase:", toyToSave)
      
      // Update in Firebase
      await updateToy(editedToy.id, toyToSave)
      console.log("Firebase update successful")
      
      // Update local state with the properly formatted data
      const updatedToy = { ...toyToSave, id: editedToy.id }
      
      const updatedList = storeToysList.map(toy =>
        toy.id === editedToy.id ? updatedToy : toy
      )
      
      console.log("Updating local state with:", updatedToy)
      setToyList(updatedList)
      setEditingToyId(null)
      
      // Reset states after successful save
      setTouched({})
      setErrors({})
      setSaveSuccess(true)
      console.log("Save operation completed successfully")
    } catch (error) {
      console.error('Error during save operation:', error)
      setSaveError(`Failed to save changes: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // funktion för att avbryta redigering
  const handleCancelEdit = () => {
    setEditingToyId(null)
    setErrors({})
    setTouched({})
    setSaveError(null)
    setSaveSuccess(false)
  }
  
  // funktion för att ta bort en leksak
  const handleDelete = async (id) => {
    try {
      setIsSubmitting(true)
      console.log(`Deleting toy with ID: ${id}`)
      await deleteToy(id)
      
      const updatedList = storeToysList.filter(toy => toy.id !== id)
      setToyList(updatedList)
      setEditingToyId(null)
      setSaveSuccess(true)
    } catch (error) {
      console.error('Error deleting toy:', error)
      setSaveError(`Failed to delete item: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Funktion för att hantera inmatning i formuläret för ny leksak
  const handleNewToyChange = (event) => {
    const { name, value } = event.target
    
    setNewToy({ ...newToy, [name]: value })
    
    // makra fältet som "touched" för att visa felmeddelanden
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // valdera fältet - ensure price is validated as a number
    if (name === 'price') {
      try {
        const numberValue = value ? Number(value) : 0
        validateField(name, numberValue)
      } catch (e) {
        console.error("Error validating price:", e)
      }
    } else {
      validateField(name, value)
    }
  }

  // Funktion för att hantera ändringar i redigeringsformuläret
  const handleEditChange = (field, value) => {
    setEditedToy({ ...editedToy, [field]: value })
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate field - ensure price is validated as a number
    if (field === 'price') {
      try {
        const numberValue = value ? Number(value) : 0
        validateField(field, numberValue)
      } catch (e) {
        console.error("Error validating price:", e)
      }
    } else {
      validateField(field, value)
    }
  }

  // Funktion för att lägga till ny leksak
  const handleAddToy = async (event) => {
    event.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      // Parse price to number
      let parsedPrice = 0
      try {
        parsedPrice = Number(newToy.price)
        if (isNaN(parsedPrice)) {
          setErrors(prev => ({ ...prev, price: "Price must be a valid number" }))
          setTouched(prev => ({ ...prev, price: true }))
          setIsSubmitting(false)
          return
        }
      } catch (e) {
        console.error("Error parsing price:", e)
        setErrors(prev => ({ ...prev, price: "Price must be a valid number" }))
        setTouched(prev => ({ ...prev, price: true }))
        setIsSubmitting(false)
        return
      }
      
      // Create clean object for validation and saving
      const toyToSave = {
        name: newToy.name?.trim() || "",
        description: newToy.description?.trim() || "",
        category: newToy.category?.trim() || "",
        era: newToy.era?.trim() || "",
        price: parsedPrice,
        imgLink: newToy.imgLink?.trim() || ""
      }
      
      // Mark all fields as touched to show any validation errors
      const allTouched = {
        name: true,
        description: true,
        category: true,
        era: true,
        price: true,
        imgLink: true
      }
      setTouched(allTouched)
      
      // Validate innan submit
      if (!validateForm(toyToSave)) {
        setIsSubmitting(false)
        return // Don't proceed if validation fails
      }
      
      // Lägg till leksaken i Firestore och få tillbaka den med ID
      const addedToy = await addToy(toyToSave)
      
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
      setSaveSuccess(true)
    } catch (error) {
      console.error('Fel vid tillägg av ny leksak:', error)
      setSaveError(`Failed to add new toy: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Check om formuläret är giltigt innan submitt
  const isFormValid = () => {
    const hasErrors = Object.keys(errors).length > 0
    
    const requiredFieldsFilled = 
      newToy.name?.trim() &&
      newToy.description?.trim() &&
      newToy.category?.trim() &&
      newToy.era?.trim() &&
      newToy.price?.toString().trim()
    
    return requiredFieldsFilled && !hasErrors
  }

  // Check om edit formuläret är giltigt innan submitt
  const isEditFormValid = () => {
    const hasErrors = Object.keys(errors).length > 0
    
    const requiredFieldsFilled = 
      editedToy.name?.trim() &&
      editedToy.description?.trim() &&
      editedToy.category?.trim() &&
      editedToy.era?.trim() &&
      (editedToy.price || editedToy.price === 0)
    
    return requiredFieldsFilled && !hasErrors
  }

  // hantera blur event för att markera fält som "touched"
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        {saveSuccess && <div className="success-message">Operation completed successfully!</div>}
      </div>

      <div className="add-toy-form">
        <h2>Add new Toy</h2>
        <form onSubmit={handleAddToy}>
          <div className="form-group">
            <label htmlFor="name">Namn*:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newToy.name || ''}
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
              value={newToy.description || ''}
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
              value={newToy.category || ''}
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
              type="number"
              id="price"
              name="price"
              min="0"
              step="1"
              value={newToy.price || ''}
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
              value={newToy.era || ''}
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
              value={newToy.imgLink || ''}
              onChange={handleNewToyChange}
              onBlur={() => handleBlur('imgLink')}
            />
            {touched.imgLink && errors.imgLink && (
              <p className="error-text">{errors.imgLink}</p>
            )}
          </div>
          
          {saveError && <p className="error-text">{saveError}</p>}
          
          <button 
            type="submit" 
            className="save-button"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Lägg till'}
          </button>
        </form>
      </div>

      <div className="toy-grid">
        {storeToysList.map(toy => (
          <div key={toy.id} className="toy-card">
            <img 
              src={toy.imgLink || 'https://via.placeholder.com/160'} 
              className="toy-image" 
              alt={toy.name} 
              onError={(event) => {
                event.target.onerror = null;
                event.target.src = 'https://via.placeholder.com/160?text=No+Image';
              }}
            />

            {editingToyId === toy.id ? (
              <div className="edit-form">
                <input
                  className="edit-input"
                  value={editedToy.name || ''}
                  onChange={event => handleEditChange('name', event.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Name"
                />
                {touched.name && errors.name && <p className="error-text">{errors.name}</p>}
                
                <input
                  className="edit-input"
                  value={editedToy.category || ''}
                  onChange={event => handleEditChange('category', event.target.value)}
                  onBlur={() => handleBlur('category')}
                  placeholder="Category"
                />
                {touched.category && errors.category && <p className="error-text">{errors.category}</p>}
                
                <input
                  className="edit-input"
                  value={editedToy.era || ''}
                  onChange={event => handleEditChange('era', event.target.value)}
                  onBlur={() => handleBlur('era')}
                  placeholder="Era"
                />
                {touched.era && errors.era && <p className="error-text">{errors.era}</p>}
                
                <input
                  className="edit-input"
                  type="number"
                  min="0"
                  step="1"
                  value={editedToy.price || ''}
                  onChange={event => handleEditChange('price', event.target.value)}
                  onBlur={() => handleBlur('price')}
                  placeholder="Price (SEK)"
                />
                {touched.price && errors.price && <p className="error-text">{errors.price}</p>}
                
                <input
                  className="edit-input"
                  value={editedToy.imgLink || ''}
                  onChange={event => handleEditChange('imgLink', event.target.value)}
                  onBlur={() => handleBlur('imgLink')}
                  placeholder="Image URL"
                />
                {touched.imgLink && errors.imgLink && <p className="error-text">{errors.imgLink}</p>}
                
                <textarea
                  className="edit-textarea"  
                  rows="3"
                  value={editedToy.description || ''}
                  onChange={event => handleEditChange('description', event.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Description"
                />
                {touched.description && errors.description && <p className="error-text">{errors.description}</p>}
                
                {saveError && <p className="error-text">{saveError}</p>}
                
                <div className="edit-buttons">
                  <button 
                    onClick={handleSave} 
                    className="save-button" 
                    disabled={!isEditFormValid() || isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => handleDelete(editedToy.id)} 
                    className="delete-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="cancel-button"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="toy-title">{toy.name}</h2>
                <p className="toy-category">Category: {toy.category}</p>
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