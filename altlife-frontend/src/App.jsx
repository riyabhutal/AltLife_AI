import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Choices from './pages/Choices'
import Outcome from './pages/Outcome'
import History from './pages/History'
import Landing from './pages/Landing'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('altlife_token')
    const savedUser = localStorage.getItem('altlife_user')
    if (token && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem('altlife_token', token)
    localStorage.setItem('altlife_user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('altlife_token')
    localStorage.removeItem('altlife_user')
    sessionStorage.removeItem('altlife_profile')
    sessionStorage.removeItem('altlife_choice')
    sessionStorage.removeItem('prediction_result')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/profile" /> : 
                  <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? 
                  <Profile user={user} /> : 
                  <Navigate to="/login" />
              } 
            />
            <Route 
              path="/choices" 
              element={
                isAuthenticated ? 
                  <Choices /> : 
                  <Navigate to="/login" />
              } 
            />
            <Route 
              path="/outcome" 
              element={
                isAuthenticated ? 
                  <Outcome /> : 
                  <Navigate to="/login" />
              } 
            />
            <Route 
              path="/history" 
              element={
                isAuthenticated ? 
                  <History user={user} /> : 
                  <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
