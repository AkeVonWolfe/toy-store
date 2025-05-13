import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firestore.js";
import vintageToys from "./toysdata.js"

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
const updateToy = async (toyId, editaedToy) =>{
    try {
        const toyRef = doc(db, 'Toys', toyId) // Referera till den specifika leksaken i Firestore
        await updateDoc(toyRef, editaedToy)
    }
    catch (error) {
        console.error('Fel vid uppdatering av leksak: ', error) 
    }
}

// omvandlad funktion från send message firebare pratice
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

