import { addDoc, collection, doc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export interface CardData {
  senderName: string
  recipientName: string
  message: string
  backgroundColor: string
  cakeColor: string
  envelopeColor: string
  confettiColor: string
  confettiType: 'heart' | 'star' | 'snow'
  email: string
  language: 'tr' | 'en'
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
    backgroundColor: payload.backgroundColor || '#2b84ea',
    cakeColor: payload.cakeColor || '#2b84ea',
    envelopeColor: payload.envelopeColor || '#2b84ea',
    confettiColor: payload.confettiColor || '#2b84ea',
    confettiType: payload.confettiType,
    email: payload.email,
    language: payload.language || 'tr',
    createdAt: payload.createdAt,
  }
}
