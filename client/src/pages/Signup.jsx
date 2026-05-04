import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, user }      = useAuth();
  const navigate              = useNavigate();

  useEffect(() => { if (user) navigate('/home'); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'grid',
      gridTemplateColumns:'1fr 1fr',
    }}>
      {/* Left — branding */}
      <div style={{
        background:'#1C1C1A', padding:'60px 56px',
        display:'flex', flexDirection:'column', justifyContent:'center',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:-80, left:-80,
          width:300, height:300, borderRadius:'50%',
          background:'rgba(196,98,45,.1)', pointerEvents:'none',
        }} />
        <div style={{
          position:'absolute', bottom:-60, right:-60,
          width:200, height:200, borderRadius:'50%',
          background:'rgba(122,158,126,.08)', pointerEvents:'none',
        }} />

        {/* Logo */}
        <Link to="/" style={{ textDecoration:'none', marginBottom:48, position:'relative', zIndex:1 }}>
          <div style={{ fontSize:26, fontWeight:900 }}>
            <span style={{ color:'#fff' }}>Meal</span>
            <span style={{ color:'#C4622D' }}>Forge</span>
          </div>
        </Link>

        <h2 style={{
          fontSize:34, fontWeight:900, color:'#fff',
          lineHeight:1.15, marginBottom:14, letterSpacing:'-.5px',
          position:'relative', zIndex:1,
        }}>
          Your kitchen,<br />
          <em style={{ color:'#E8876A', fontStyle:'italic' }}>infinite recipes.</em>
        </h2>

        <p style={{
          fontSize:14, color:'#6A6A67', lineHeight:1.7,
          marginBottom:32, position:'relative', zIndex:1,
        }}>
          Join thousands of home cooks who never run out of meal ideas.
        </p>

        {[
          'Match recipes to your ingredients',
          'AI-powered recipe generation',
          'Save favourites & meal history',
          '100% free, no credit card needed',
        ].map(b => (
          <div key={b} style={{
            display:'flex', alignItems:'center', gap:10,
            marginBottom:12, position:'relative', zIndex:1,
          }}>
            <span style={{ color:'#7A9E7E', fontSize:16, fontWeight:700 }}>✓</span>
            <span style={{ fontSize:13, color:'#8A8578' }}>{b}</span>
          </div>
        ))}

        <div style={{
          marginTop:40, background:'#2A2A27', borderRadius:14,
          padding:'20px 24px', position:'relative', zIndex:1,
        }}>
          <p style={{ fontSize:13, color:'#C0B8B0', lineHeight:1.6, fontStyle:'italic' }}>
            "MealForge changed how I cook — I never waste food anymore. It's genuinely magic."
          </p>
          <p style={{ fontSize:11, color:'#D4A843', marginTop:10, fontWeight:700 }}>
            — Jungle JalebI.,kacha Nimbu  ⭐⭐⭐⭐⭐
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        background:'#FAF7F2', padding:'60px 56px',
        display:'flex', flexDirection:'column', justifyContent:'center',
      }}>
        <h1 style={{
          fontSize:28, fontWeight:900, color:'#1C1C1A', marginBottom:4,
        }}>Create your account</h1>
        <p style={{ fontSize:14, color:'#8A8578', marginBottom:36 }}>
          Free forever. No credit card needed.
        </p>

        {error && (
          <div style={{
            background:'#fef2f2', border:'1.5px solid #fecaca',
            color:'#dc2626', fontSize:13, padding:'12px 16px',
            borderRadius:10, marginBottom:20,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom:18 }}>
            <label style={{
              display:'block', fontSize:12, fontWeight:700,
              color:'#2D2D2A', marginBottom:7, letterSpacing:'.3px',
            }}>Full Name</label>
            <input
              type="text" value={name} required
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width:'100%', padding:'13px 16px',
                border:'1.5px solid #E0D8CC', borderRadius:10,
                fontSize:14, background:'#fff', color:'#1C1C1A',
                outline:'none', transition:'border-color .2s',
                fontFamily:'inherit',
              }}
              onFocus={e => e.target.style.borderColor='#C4622D'}
              onBlur={e => e.target.style.borderColor='#E0D8CC'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom:18 }}>
            <label style={{
              display:'block', fontSize:12, fontWeight:700,
              color:'#2D2D2A', marginBottom:7,
            }}>Email Address</label>
            <input
              type="email" value={email} required
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width:'100%', padding:'13px 16px',
                border:'1.5px solid #E0D8CC', borderRadius:10,
                fontSize:14, background:'#fff', color:'#1C1C1A',
                outline:'none', transition:'border-color .2s',
                fontFamily:'inherit',
              }}
              onFocus={e => e.target.style.borderColor='#C4622D'}
              onBlur={e => e.target.style.borderColor='#E0D8CC'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:24 }}>
            <label style={{
              display:'block', fontSize:12, fontWeight:700,
              color:'#2D2D2A', marginBottom:7,
            }}>Password</label>
            <input
              type="password" value={password} required
              onChange={e => setPass(e.target.value)}
              placeholder="Min. 6 characters"
              style={{
                width:'100%', padding:'13px 16px',
                border:'1.5px solid #E0D8CC', borderRadius:10,
                fontSize:14, background:'#fff', color:'#1C1C1A',
                outline:'none', transition:'border-color .2s',
                fontFamily:'inherit',
              }}
              onFocus={e => e.target.style.borderColor='#C4622D'}
              onBlur={e => e.target.style.borderColor='#E0D8CC'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width:'100%', padding:'14px',
              background: loading ? '#E0D8CC' : '#1C1C1A',
              border:'none', borderRadius:12,
              color:'#fff', fontSize:14, fontWeight:800,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition:'background .2s', fontFamily:'inherit',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background='#C4622D'; }}
            onMouseLeave={e => { if (!loading) e.target.style.background='#1C1C1A'; }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{
          display:'flex', alignItems:'center', gap:12, margin:'20px 0',
        }}>
          <hr style={{ flex:1, border:'none', borderTop:'1px solid #E0D8CC' }} />
          <span style={{ fontSize:12, color:'#8A8578' }}>or</span>
          <hr style={{ flex:1, border:'none', borderTop:'1px solid #E0D8CC' }} />
        </div>

        <Link to="/login" style={{
          display:'block', width:'100%', padding:'13px',
          border:'1.5px solid #E0D8CC', borderRadius:12,
          background:'#F5F0E8', fontSize:13, fontWeight:600,
          color:'#1C1C1A', textDecoration:'none', textAlign:'center',
          transition:'all .2s',
        }}>
          Already have an account? Sign In
        </Link>

        <p style={{
          textAlign:'center', fontSize:12, color:'#8A8578',
          marginTop:24, lineHeight:1.6,
        }}>
          By signing up you agree to our Terms of Service.<br />
          Your data is safe and never shared.
        </p>
      </div>
    </div>
  );
}