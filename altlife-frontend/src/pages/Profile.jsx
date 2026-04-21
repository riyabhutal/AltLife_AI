import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiCalendar, FiBriefcase, FiTarget, FiHeart, FiArrowRight, FiSave } from 'react-icons/fi'
import toast from 'react-hot-toast'
import './Profile.css'

const careers = [
  'Software Engineer', 'Doctor', 'Teacher', 'Artist', 'Business Owner',
  'Lawyer', 'Scientist', 'Writer', 'Marketing', 'Finance', 'Designer',
  'Nurse', 'Architect', 'Chef', 'Entrepreneur'
]

const lifestyles = [
  { value: 'Minimalist', icon: '🌿', desc: 'Simple living, focused on essentials' },
  { value: 'Balanced', icon: '⚖️', desc: 'Harmony between work and life' },
  { value: 'Luxurious', icon: '✨', desc: 'Enjoying the finer things' },
  { value: 'Adventure-seeker', icon: '🌍', desc: 'Always seeking new experiences' },
  { value: 'Family-focused', icon: '👨‍👩‍👧', desc: 'Prioritizing loved ones' },
  { value: 'Career-driven', icon: '🚀', desc: 'Ambitious professional growth' }
]

function Profile({ user }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    age: 25,
    career: '',
    goals: '',
    lifestyle: ''
  })

  useEffect(() => {
    const savedProfile = sessionStorage.getItem('altlife_profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (user) {
      setProfile(prev => ({ ...prev, name: user.username }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }))
  }

  const handleLifestyleSelect = (lifestyle) => {
    setProfile(prev => ({ ...prev, lifestyle }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!profile.name || !profile.career || !profile.lifestyle) {
      toast.error('Please fill in all required fields')
      return
    }

    if (profile.age < 18 || profile.age > 80) {
      toast.error('Age must be between 18 and 80')
      return
    }

    setLoading(true)
    sessionStorage.setItem('altlife_profile', JSON.stringify(profile))
    
    setTimeout(() => {
      toast.success('Profile saved! Now choose your life path.')
      setLoading(false)
      navigate('/choices')
    }, 500)
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Create Your Profile</h1>
          <p className="page-subtitle">Tell us about yourself so we can predict your alternate futures</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-section glass-card animate-fade-up">
              <h3 className="section-title">
                <FiUser />
                Personal Details
              </h3>
              
              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  <FiCalendar style={{ marginRight: 8 }} />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  min="18"
                  max="80"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  <FiBriefcase style={{ marginRight: 8 }} />
                  Current Career
                </label>
                <select
                  name="career"
                  value={profile.career}
                  onChange={handleChange}
                  className="input-field select-field"
                  required
                >
                  <option value="">Select your career</option>
                  {careers.map(career => (
                    <option key={career} value={career}>{career}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>
                  <FiTarget style={{ marginRight: 8 }} />
                  Life Goals (Optional)
                </label>
                <textarea
                  name="goals"
                  value={profile.goals}
                  onChange={handleChange}
                  placeholder="What do you aspire to achieve?"
                  className="input-field textarea-field"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section glass-card animate-fade-up stagger-2">
              <h3 className="section-title">
                <FiHeart />
                Choose Your Lifestyle
              </h3>
              
              <div className="lifestyle-grid">
                {lifestyles.map((ls, index) => (
                  <div
                    key={ls.value}
                    className={`lifestyle-card ${profile.lifestyle === ls.value ? 'selected' : ''}`}
                    onClick={() => handleLifestyleSelect(ls.value)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="lifestyle-icon">{ls.icon}</span>
                    <h4>{ls.value}</h4>
                    <p>{ls.desc}</p>
                    {profile.lifestyle === ls.value && (
                      <div className="selected-indicator">
                        <FiSave />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions animate-fade-up stagger-3">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <>
                  Continue to Life Paths
                  <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
