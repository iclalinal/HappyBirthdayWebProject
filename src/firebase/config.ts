import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, type Analytics } from 'firebase/analytics'

// Env üzerinden okuyoruz; repo içinde anahtar saklamıyoruz.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingKeys.length) {
  const message = `Firebase config eksik. Lütfen .env dosyasını kontrol et. Eksik anahtarlar: ${missingKeys.join(
    ', ',
  )}`
  // Hata fırlatmak, uygulamanın sessizce beyaz ekranda kalmasını engeller ve konsolda net mesaj verir.
  throw new Error(message)
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
export { analytics }