import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiUser, FiGrid, FiTarget, FiClock, FiLogOut, FiLogIn } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import './Navbar.css'

function Navbar({ isAuthenticated, user, onLogout }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <HiSparkles className="logo-icon" />
          <span className="logo-text">AltLife AI</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                <FiUser />
                <span>Profile</span>
              </Link>
              <Link to="/choices" className={`nav-link ${isActive('/choices') ? 'active' : ''}`}>
                <FiGrid />
                <span>Choices</span>
              </Link>
              <Link to="/outcome" className={`nav-link ${isActive('/outcome') ? 'active' : ''}`}>
                <FiTarget />
                <span>Outcome</span>
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                <FiClock />
                <span>History</span>
              </Link>
              <div className="nav-divider"></div>
              <div className="user-info">
                <span className="username">{user?.username}</span>
                {user?.is_admin && <span className="admin-badge">Admin</span>}
              </div>
              <button onClick={onLogout} className="nav-link logout-btn">
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary nav-cta">
              <FiLogIn />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
