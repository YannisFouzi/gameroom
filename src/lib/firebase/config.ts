import { getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let firestore: Firestore;

function initializeFirebase() {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized");
    } else {
      app = getApps()[0];
    }

    if (!firestore) {
      firestore = getFirestore(app);
      console.log("Firestore initialized");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
}

export function getDb(): Firestore {
  if (!firestore) {
    initializeFirebase();
  }
  return firestore;
}

// Initialiser Firebase au chargement du module
initializeFirebase();
