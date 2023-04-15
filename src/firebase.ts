import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore/lite";
import { randomUUID } from "crypto";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export async function createTicket(threadId: string) {
  const secret = randomUUID();
  try {
    await addDoc(collection(db, "tickets"), {
      threadId,
      openAt: Date(),
      secret: secret,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  return secret;
}

export async function getTicket(secret: string) {
  const tickets = await getDocs(query(collection(db, "tickets")));

  let ticket = null;
  for (const doc of tickets.docs) {
    if (doc.data().secret === secret) {
      ticket = doc.data();
      break;
    }
  }

  return ticket;
}
