// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast'
import { ToastProvider } from './context/ToastContext'
import { LanguageProvider } from './context/LanguageContext'

// Dosya yollarını kontrol et!
// Eğer dosyaların "src/pages" içindeyse yollar böyle olmalı:
import CreateCard from './pages/CreateCard'
import ViewCard from './pages/ViewCard' 

// CSS dosyanın yeri değişmediyse:
import './styles.css' 

const basename = import.meta.env.BASE_URL || '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <ErrorBoundary>
        <ToastProvider>
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<CreateCard />} />
              <Route path="/card/:id" element={<ViewCard />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </ToastProvider>
      </ErrorBoundary>
    </LanguageProvider>
  </React.StrictMode>,
)