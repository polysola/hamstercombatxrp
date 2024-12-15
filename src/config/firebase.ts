import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
export const db = getFirestore(app);