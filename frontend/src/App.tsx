import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PWAWrapper } from './components/pwa-wrapper'
import { Header } from './components/header'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import Footer from './components/footer'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <PWAWrapper>
          <Header />
          <main id="main-content" role="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </main>
          <Footer />
        </PWAWrapper>
      </Router>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App