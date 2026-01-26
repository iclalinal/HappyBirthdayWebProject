import { addDoc, collection, doc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export interface CardData {
  senderName: string
  recipientName: string
  message: string
  theme: 'ocean' | 'sunset' | 'lavender'
  confettiType: 'heart' | 'star' | 'snow'
  email: string
  createdAt?: Timestamp
}

const CARDS_COLLECTION = 'cards'

export const createCard = async (data: Omit<CardData, 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, CARDS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const getCard = async (id: string): Promise<CardData | null> => {
  const docRef = doc(db, CARDS_COLLECTION, id)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    return null
  }

  const payload = snapshot.data()

  return {
    senderName: payload.senderName,
    recipientName: payload.recipientName,
    message: payload.message,
    theme: payload.theme,
    confettiType: payload.confettiType,
    email: payload.email,
    createdAt: payload.createdAt,
  }
}
