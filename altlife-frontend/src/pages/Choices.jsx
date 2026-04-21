import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBriefcase,
  FiDollarSign,
  FiPenTool,
  FiBook,
  FiGlobe,
  FiHeart,
  FiArrowRight,
  FiArrowLeft
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import './Choices.css'

const lifePaths = [
  {
    id: 'Corporate Ladder',
    icon: <FiBriefcase />,
    title: 'Corporate Ladder',
    description: 'Climb the corporate hierarchy. Focus on promotions, networking, and building influence.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    traits: ['Ambitious', 'Strategic', 'Disciplined']
  },
  {
    id: 'Entrepreneurship',
    icon: <FiDollarSign />,
    title: 'Entrepreneurship',
    description: 'Build your own empire. Take risks, innovate, and create something impactful.',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    traits: ['Risk-taker', 'Visionary', 'Resilient']
  },
  {
    id: 'Creative Pursuit',
    icon: <FiPenTool />,
    title: 'Creative Pursuit',
    description: 'Follow your artistic passion. Express creativity in any form.',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    traits: ['Expressive', 'Imaginative', 'Authentic']
  },
  {
    id: 'Academic Excellence',
    icon: <FiBook />,
    title: 'Academic Excellence',
    description: 'Pursue knowledge and research. Contribute to human understanding.',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    traits: ['Curious', 'Analytical', 'Dedicated']
  },
  {
    id: 'World Explorer',
    icon: <FiGlobe />,
    title: 'World Explorer',
    description: 'See the world and collect experiences. Prioritize adventure.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    traits: ['Adventurous', 'Open-minded', 'Free-spirited']
  },
  {
    id: 'Work-Life Balance',
    icon: <FiHeart />,
    title: 'Work-Life Balance',
    description: 'Harmonize career and personal life. Sustainable success without burnout.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    traits: ['Balanced', 'Mindful', 'Content']
  }
]

function Choices() {
  const navigate = useNavigate()
  const [selectedPath, setSelectedPath] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const savedProfile = sessionStorage.getItem("altlife_profile")
    const savedChoice = sessionStorage.getItem("altlife_choice")

    if (!savedProfile) {
      toast.error("Please complete your profile first")
      navigate("/profile")
      return
    }

    setProfile(JSON.parse(savedProfile))
    if (savedChoice) setSelectedPath(savedChoice)
  }, [])

  const handleSelect = (pathId) => {
    setSelectedPath(pathId)
  }

  const handleContinue = () => {
    if (!selectedPath) {
      toast.error("Please select a life path")
      return
    }

    // 🔥🔥🔥 MOST IMPORTANT FIX 🔥🔥🔥
    // old prediction hatao warna wrong outcome aayega
    sessionStorage.removeItem("prediction_result")

    sessionStorage.setItem("altlife_choice", selectedPath)
    toast.success("Life path selected!")
    navigate("/outcome")
  }

  return (
    <div className="choices-page">
      <div className="container">

        <div className="page-header">
          <h1 className="page-title">Choose Your Life Path</h1>
          <p className="page-subtitle">
            {profile ? `${profile.name}, which direction will you take?` : ""}
          </p>
        </div>

        <div className="paths-grid">
          {lifePaths.map((path, index) => (
            <div
              key={path.id}
              className={`path-card ${selectedPath === path.id ? "selected" : ""}`}
              onClick={() => handleSelect(path.id)}
              style={{
                "--path-color": path.color,
                "--path-gradient": path.gradient,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="path-icon-wrapper">
                <div className="path-icon" style={{ background: path.gradient }}>
                  {path.icon}
                </div>
              </div>

              <h3 className="path-title">{path.title}</h3>
              <p className="path-description">{path.description}</p>

              <div className="path-traits">
                {path.traits.map(trait => (
                  <span key={trait} className="trait-tag">{trait}</span>
                ))}
              </div>

              {selectedPath === path.id && (
                <div className="selected-badge">
                  <span>Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="choices-actions animate-fade-up">
          <button onClick={() => navigate('/profile')} className="btn btn-secondary">
            <FiArrowLeft />
            Back to Profile
          </button>

          <button
            onClick={handleContinue}
            className="btn btn-primary btn-lg"
            disabled={!selectedPath}
          >
            See Your Future
            <FiArrowRight />
          </button>
        </div>

      </div>
    </div>
  )
}

export default Choices
