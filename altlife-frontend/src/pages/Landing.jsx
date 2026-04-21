import { Link } from 'react-router-dom'
import { FiArrowRight, FiZap, FiTrendingUp, FiHeart, FiDollarSign, FiCpu, FiShield } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import './Landing.css'

function Landing() {
  const features = [
    {
      icon: <FiCpu />,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze your profile to generate accurate life predictions.'
    },
    {
      icon: <FiHeart />,
      title: 'Happiness Metrics',
      description: 'Discover how different life paths affect your overall happiness and well-being.'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Success Forecasting',
      description: 'See your potential for career success based on your choices and personality.'
    },
    {
      icon: <FiDollarSign />,
      title: 'Financial Outlook',
      description: 'Get insights into your financial future with each life path you consider.'
    },
    {
      icon: <FiZap />,
      title: '6-Year Projections',
      description: 'Watch your predicted metrics evolve over a comprehensive six-year timeline.'
    },
    {
      icon: <FiShield />,
      title: 'Personalized Stories',
      description: 'Receive unique narratives crafted specifically for your alternate future.'
    }
  ]

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <HiSparkles />
            <span>AI-Powered Life Simulation</span>
          </div>
          <h1 className="hero-title">
            Discover Your
            <span className="gradient-text"> Alternate Future</span>
          </h1>
          <p className="hero-subtitle">
            Make life decisions with confidence. Our AI predicts your happiness, success, 
            and financial outcomes across different life paths. Your future, visualized.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              Start Your Journey
              <FiArrowRight />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-header">
              <span className="visual-label">Your Predicted Score</span>
              <span className="visual-score">87%</span>
            </div>
            <div className="visual-bars">
              <div className="bar-item">
                <span>Happiness</span>
                <div className="bar-track">
                  <div className="bar-fill happiness" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="bar-item">
                <span>Success</span>
                <div className="bar-track">
                  <div className="bar-fill success" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="bar-item">
                <span>Finance</span>
                <div className="bar-track">
                  <div className="bar-fill finance" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powered by Machine Learning</h2>
            <p>Our RandomForest algorithm learns from thousands of life patterns to give you accurate predictions</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card animate-fade-up stagger-${index + 1}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card">
            <h2>Ready to See Your Future?</h2>
            <p>Create your profile and explore unlimited alternate futures with AI-powered predictions.</p>
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started Free
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
