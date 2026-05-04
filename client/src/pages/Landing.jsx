import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
export default function Landing() {
  return (
    <div style={{minHeight:'100vh', background:'var(--cream)'}}>

      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <span className="logo-pan">Meal</span><span className="logo-try">Forge</span>
        </div>
        <div className="landing-header-actions">
          <Link to="/login"  className="btn btn-outline btn-sm">Login</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Sign Up Free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero animate-fadeUp">
        <h1>Cook what you<br /><em>already have.</em></h1>
        <p>Add ingredients from your kitchen and instantly discover every recipe you can make — no extra shopping required.</p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free ✦</Link>
          <Link to="/login?guest=true" className="btn btn-outline btn-lg">Try as Guest 👤</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[['12,000+','Recipes'],['500+','Ingredients'],['Free','Always'],['AI','Powered']].map(([n,l]) => (
          <div className="stat" key={l}>
            <div className="stat-number">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="features-section">
  <h2>Everything you need to cook smarter</h2>

  <div className="features-grid">
    {[
      ['🔍','#C4622D','Smart Matching','Find recipes based on exact ingredients you own. Best matches always shown first.'],
      ['🤖','#7A5FB0','AI Chef','Gemini AI generates completely custom recipes tailored to exactly what you have.'],
      ['❤️','#7A9E7E','Save & History',"Bookmark your favourite recipes and track every search you've ever made."],
      ['🛡️','#D4A843','Admin Panel','Full content moderation and user management for administrators.'],
    ].map(([icon, col, title, desc]) => (
      <div className="feature-card" key={title}>
        <div className="feature-icon" style={{ background: col }}>{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    ))}
  </div>
</section>

      {/* Popular */}
      <section className="popular-section">
        <h2>🔥 Popular this week</h2>
        <div className="popular-grid">
          {[
            ['🍳','linear-gradient(135deg,#f0e8a0,#d4c050)','French Omelette','8 min · Easy'],
            ['🍅','linear-gradient(135deg,#f0c4c0,#e08880)','Shakshuka','20 min · Easy'],
            ['🍚','linear-gradient(135deg,#b8d4e8,#7aafe0)','Egg Fried Rice','15 min · Easy'],
            ['🥬','linear-gradient(135deg,#b8e8c4,#7aba8a)','Palak Paneer','25 min · Medium'],
          ].map(([em,bg,title,meta]) => (
            <div className="popular-card" key={title}>
              <div className="popular-img" style={{background:bg}}>{em}</div>
              <div className="popular-body">
                <h4>{title}</h4>
                <p>⏱ {meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to cook smarter?</h2>
        <p>Join thousands of home cooks who never waste food or run out of ideas.</p>
        <Link to="/signup" className="btn btn-lg" style={{background:'#fff',color:'var(--terra)',fontWeight:900}}>
          Create Free Account →
        </Link>
      </section>

      <Footer />
    </div>
  );
}