import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout, isAdmin, isGuest } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const p         = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
  ['/home',    'Explore'],
  ...(!isGuest ? [['/saved',   '❤️ Saved']] : []),
  ...(!isGuest ? [['/history', '🕐 History']] : []),
  ...(!isGuest ? [['/pantry',  '🥘 Pantry']] : []),
  ...(!isGuest ? [['/ai',     '🤖 AI Chef']] : []),
  ...(isAdmin ? [['/admin', '🛡️ Admin']] : []),
];

  return (
    <>
      <header style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(250,247,242,0.97)',
        backdropFilter:'blur(12px)',
        borderBottom:'1px solid #E0D8CC',
        height:64,
        display:'flex', alignItems:'center',
      }}>
        <div style={{
          width:'100%', maxWidth:1280, margin:'0 auto',
          padding:'0 24px',
          display:'flex', alignItems:'center',
          justifyContent:'space-between', gap:16,
        }}>

          {/* Logo */}
          <Link to={user ? '/home' : '/'} style={{
            fontSize:22, fontWeight:900,
            letterSpacing:'-.5px', textDecoration:'none', flexShrink:0,
          }}>
            <span style={{color:'#1C1C1A'}}>Meal</span>
            <span style={{color:'#C4622D'}}>Forge</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <nav style={{
              display:'flex', alignItems:'center', gap:24,
              flex:1, justifyContent:'center',
            }}
              className="desktop-nav"
            >
              {navLinks.map(([to, label]) => (
                <Link key={to} to={to} style={{
                  fontSize:13, fontWeight: p===to ? 700 : 500,
                  color: p===to ? '#C4622D' : '#8A8578',
                  textDecoration:'none', transition:'color .2s',
                  whiteSpace:'nowrap',
                }}>{label}</Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div style={{display:'flex', alignItems:'center', gap:10, flexShrink:0}}>
            {user ? (
              <>
                <span style={{
                  fontSize:13, color:'#8A8578',
                  background:'#F5F0E8', padding:'6px 14px',
                  borderRadius:100, border:'1px solid #E0D8CC',
                  whiteSpace:'nowrap',
                  display:'block',
                }}
                  className="desktop-only"
                >
                  {isGuest ? '👤 Guest' : `👋 ${user.name?.split(' ')[0]}`}
                </span>
                {isGuest && (
                  <Link to="/signup" style={{
                    background:'#C4622D', color:'#fff',
                    padding:'8px 18px', borderRadius:100,
                    fontSize:13, fontWeight:700,
                    textDecoration:'none', whiteSpace:'nowrap',
                  }}>Sign Up</Link>
                )}
                <button onClick={handleLogout} style={{
                  background:'none', border:'1px solid #E0D8CC',
                  color:'#8A8578', padding:'7px 16px',
                  borderRadius:100, fontSize:13, cursor:'pointer',
                  whiteSpace:'nowrap',
                }}
                  className="desktop-only"
                >
                  {isGuest ? 'Exit' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color:'#8A8578', fontSize:13,
                  textDecoration:'none', padding:'7px 16px',
                  borderRadius:100, border:'1px solid #E0D8CC',
                  background:'#F5F0E8',
                }}>Login</Link>
                <Link to="/signup" style={{
                  background:'#C4622D', color:'#fff',
                  padding:'8px 18px', borderRadius:100,
                  fontSize:13, fontWeight:700, textDecoration:'none',
                }}>Sign Up</Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            {user && (
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  display:'none',
                  background:'none', border:'1px solid #E0D8CC',
                  borderRadius:8, padding:'6px 10px',
                  fontSize:18, cursor:'pointer', color:'#1C1C1A',
                }}
                className="hamburger"
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:64, left:0, right:0, bottom:0,
          background:'rgba(250,247,242,.98)',
          backdropFilter:'blur(12px)',
          zIndex:99, padding:24,
          display:'flex', flexDirection:'column', gap:4,
        }}>
          {navLinks.map(([to, label]) => (
            <Link
              key={to} to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize:18, fontWeight: p===to ? 700 : 500,
                color: p===to ? '#C4622D' : '#1C1C1A',
                textDecoration:'none', padding:'14px 0',
                borderBottom:'1px solid #E0D8CC',
              }}
            >{label}</Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              marginTop:20, padding:'14px',
              background:'#1C1C1A', border:'none',
              borderRadius:14, color:'#fff',
              fontSize:15, fontWeight:700, cursor:'pointer',
            }}
          >Logout</button>
        </div>
      )}
    </>
  );
}