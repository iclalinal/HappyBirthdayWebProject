// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Dosya yollarını kontrol et!
// Eğer dosyaların "src/pages" içindeyse yollar böyle olmalı:
import CreateCard from './pages/CreateCard'
import ViewCard from './pages/ViewCard' 

// CSS dosyanın yeri değişmediyse:
import './styles.css' 

const basename = import.meta.env.BASE_URL || '/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<CreateCard />} />
        <Route path="/card/:id" element={<ViewCard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)