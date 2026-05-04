import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to:'/admin',              icon:'📊', label:'Dashboard'   },
  { to:'/admin/recipes',      icon:'🍽️', label:'Recipes'     },
  { to:'/admin/ingredients',  icon:'🥕', label:'Ingredients' },
  { to:'/admin/users',        icon:'👥', label:'Users'       },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const p                = location.pathname;

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', minHeight:'100vh', background:'#0F0F0E' }}>

      {/* Sidebar */}
      <aside style={{
        background:'#1A1A18', borderRight:'1px solid #2A2A27',
        display:'flex', flexDirection:'column',
        position:'sticky', top:0, height:'100vh', overflow:'auto',
      }}>
        {/* Logo */}
        <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid #2A2A27' }}>
          <Link to="/admin" style={{ textDecoration:'none' }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>
              Meal<span style={{ color:'#C4622D' }}>Forge</span>
              <span style={{
                fontSize:9, fontWeight:800, color:'#D4A843',
                letterSpacing:'1.5px', marginLeft:6,
                verticalAlign:'middle',
              }}>ADMIN</span>
            </div>
          </Link>
          <div style={{ fontSize:11, color:'#555', marginTop:6 }}>
            {user?.name}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'16px 0' }}>
          {NAV.map(({ to, icon, label }) => {
            const active = p === to;
            return (
              <Link key={to} to={to} style={{ textDecoration:'none' }}>
                <div style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'11px 20px', fontSize:13,
                  color: active ? '#C4622D' : '#6A6A67',
                  background: active ? '#2A2A27' : 'transparent',
                  borderLeft: `2px solid ${active ? '#C4622D' : 'transparent'}`,
                  fontWeight: active ? 700 : 400,
                  transition:'all .2s',
                }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid #2A2A27' }}>
          <Link to="/home" style={{
            display:'block', fontSize:12, color:'#6A6A67',
            textDecoration:'none', marginBottom:10,
            transition:'color .2s',
          }}>← Back to App</Link>
          <button onClick={handleLogout} style={{
            background:'none', border:'1px solid #2A2A27',
            color:'#6A6A67', padding:'7px 14px', borderRadius:8,
            fontSize:12, cursor:'pointer', width:'100%',
            transition:'all .2s',
          }}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        {/* Top bar */}
        <div style={{
          background:'#1A1A18', borderBottom:'1px solid #2A2A27',
          padding:'16px 32px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:0, zIndex:50,
        }}>
          <h1 style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{title}</h1>
          <div style={{ fontSize:12, color:'#555' }}>
            {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
        </div>

        {/* Content */}
        <main style={{ flex:1, padding:32, overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}