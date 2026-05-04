import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [tab, setTab]         = useState('login');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, guest, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/home'); }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate('/home'); }
    catch (err) { setError(err.response?.data?.error || 'Login failed.'); }
    finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
    try { await signup(name, email, password); navigate('/home'); }
    catch (err) { setError(err.response?.data?.error || 'Signup failed.'); }
    finally { setLoading(false); }
  };

  const handleGuest = async () => {
    setLoading(true);
    try { await guest(); navigate('/home'); }
    catch { setError('Could not continue as guest.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-left">
        <div className="logo">
          <span className="logo-pan">Meal</span><span className="logo-try">Forge</span>
        </div>
        <h2 className="auth-tagline">Your kitchen,<br /><em>infinite recipes.</em></h2>
        <p className="auth-subtitle">Join thousands of home cooks who never run out of meal ideas.</p>
        <ul className="auth-benefits">
          {['Match recipes to your ingredients','AI-powered recipe generation','Save favourites & meal history','100% free, no credit card needed'].map(b => (
            <li key={b}><span className="check">✓</span>{b}</li>
          ))}
        </ul>
        <div className="auth-testimonial">
          <p>"This app really said “skill issue solved” — not me becoming a chef overnight 💀"</p>
          <cite>— Nupdu P., Amateur Cook ⭐⭐⭐⭐⭐</cite>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <h1>{tab === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="sub">{tab === 'login' ? 'Sign in to your Meal Forge account' : 'Free forever. No credit card needed.'}</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab==='login' ? 'active':''}`}  onClick={() => { setTab('login');  setError(''); }}>Login</button>
          <button className={`auth-tab ${tab==='signup' ? 'active':''}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e=>setPass(e.target.value)} placeholder="••••••••••••" required />
            </div>
            <a href="#" className="forgot-link">Forgot password?</a>
            <button type="submit" className="btn btn-primary btn-full" style={{borderRadius:'10px',padding:'14px'}} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e=>setPass(e.target.value)} placeholder="Min. 6 characters" required />
            </div>
            <button type="submit" className="btn btn-dark btn-full" style={{borderRadius:'10px',padding:'14px'}} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        )}

        <div className="auth-divider"><hr /><span>or continue with</span><hr /></div>
        <button className="guest-btn" onClick={handleGuest} disabled={loading}>
          👤 Continue as Guest
        </button>
        <p className="auth-note">Guests can browse recipes but cannot save or use AI features.</p>
      </div>
    </div>
  );
}