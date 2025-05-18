import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firestore.js";
import vintageToys from "./toysdata.js"


// hämta data från firebase
async function getFirestoreData(setToyList) {
    const firebaseColletion = collection(db, 'Toys')
    const firebaseSnapshot = await getDocs(firebaseColletion)
    const firebaseList = firebaseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    setToyList(firebaseList)

    console.log('firebaseList', firebaseList)


}
// Funktion för att ta bort en leksak från Firestore
export const deleteToy = async (toyId) => {
    try {
        const toyRef = doc (db, 'Toys', toyId) // Referera till den specifika leksaken i Firestore
        await deleteDoc(toyRef) // ta bort leksaken
    }
    catch (error) {
        console.error('Fel vid borttagning av leksak: ', error) 
    }
}
// Funktion för att uppdatera en leksak i Firestore
export const updateToy = async (toyId, editedToy) => {
    if (!toyId) {
        console.error('Error: Missing toy ID for update operation');
        throw new Error('Missing toy ID');
    }
    
    try {
        console.log(`Updating toy with ID: ${toyId}`);
        console.log('Update data:', editedToy);
        
        // kollar att priset är ett nummer
        const cleanedToy = {
            ...editedToy,
            price: Number(editedToy.price)
        };
        
        const toyRef = doc(db, 'Toys', toyId);
        await updateDoc(toyRef, cleanedToy);
        console.log('Update successful');
        return true;
    } catch (error) {
        console.error('Error updating toy:', error);
        throw error; //
    }
};

// Funktion för att lägga till en ny leksak i Firestore
export const addToy = async (newToy) => {
    try {
        const toysCollection = collection(db, 'Toys');
        const newToyRef = await addDoc(toysCollection, newToy);
        console.log('Leksak tillagd med ID:', newToyRef.id);
        return { id: newToyRef.id, ...newToy }; // Returnera den nya leksaken med ID
    } catch (error) {
        console.error('Fel vid tillägg av ny leksak:', error);
        throw error;
    }
}

// omvandlad funktion från send message firebare pratice för att skicka mass data till firebase
const sendVintageToys = async () => {
    console.log('App sendVintageToys');
    try {
        const firebaseCollection = collection(db, 'Toys'); // Referera till "Toys"-collectionen

        // Lägg till varje objekt i vintageToys-arrayen som ett nytt dokument i "Toys"-collectionen
        const addedToys = await Promise.all( // Använd Promise.all för att vänta på alla asynkrona operationer
            vintageToys.map(async (toy) => { // Iterera över varje leksak i vintageToys-arrayen
                const toyRef = await addDoc(firebaseCollection, toy); // Lägg till leksaken i Firestore
                console.log('Leksak tillagd med ID: ', toyRef.id);
                return toyRef;
            })
        );

        return addedToys; // Returnera referenserna till de nya dokumenten
    } catch (error) {
        console.error('Fel vid tillägg av vintageToys: ', error);
        throw error; // Kasta felet vidare för att hantera det högre upp i anropsstacken
    }
};

export { sendVintageToys, getFirestoreData }

