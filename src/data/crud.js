import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firestore.js";
import vintageToys from "./toysdata.js"

async function getFirestoreData(setToyList) {
    const firebaseColletion = collection(db, 'Toys')
    const firebaseSnapshot = await getDocs(firebaseColletion)
    const firebaseList = firebaseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    setToyList(firebaseList)



    

}

const sendVintageToys = async () => {
    console.log('App sendVintageToys');
    try {
        const firebaseCollection = collection(db, 'Toys'); // Referera till "Toys"-collectionen

        // Lägg till varje objekt i vintageToys-arrayen som ett nytt dokument i "Toys"-collectionen
        const addedToys = await Promise.all(
            vintageToys.map(async (toy) => {
                const toyRef = await addDoc(firebaseCollection, toy);
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

export default sendVintageToys
