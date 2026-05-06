import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD55ZnU_GX7L5varAuprnWugy_FDXM1FhQ",
  authDomain: "data-sui.firebaseapp.com",
  projectId: "data-sui",
  storageBucket: "data-sui.appspot.com",
  messagingSenderId: "15867478435",
  appId: "1:15867478435:web:9d2b205c67e828c8385a16",
  measurementId: "G-9HKQLMBCKN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetDatabase() {
    console.log("Starting database reset for collection: DataXRP...");
    const colRef = collection(db, "DataXRP");
    const snapshot = await getDocs(colRef);
    console.log(`Found ${snapshot.size} documents to delete.`);
    
    const promises = snapshot.docs.map(document => {
        console.log(`Deleting document: ${document.id}`);
        return deleteDoc(doc(db, "DataXRP", document.id));
    });
    
    await Promise.all(promises);
    console.log("Database reset complete.");
    process.exit(0);
}

resetDatabase().catch(err => {
    console.error("Error resetting database:", err);
    process.exit(1);
});
