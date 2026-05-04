import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/admin/stats')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const kpis = data ? [
    { label:'Total Users',   value:data.stats.totalUsers,   icon:'👥', color:'#C4622D', change:'+12%' },
    { label:'Total Recipes', value:data.stats.totalRecipes, icon:'🍽️', color:'#7A9E7E', change:'+3%'  },
    { label:'Searches',      value:data.stats.totalSearches,icon:'🔍', color:'#D4A843', change:'+28%' },
    { label:'AI Recipes',    value:'—',                     icon:'🤖', color:'#7A5FB0', change:'New'  },
  ] : [];

  return (
    <AdminLayout title="Dashboard Overview">
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
          <div style={{
            width:44, height:44, borderRadius:'50%',
            border:'4px solid #2A2A27', borderTopColor:'#C4622D',
            animation:'spin 1s linear infinite',
          }} />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(4,1fr)',
            gap:16, marginBottom:32,
          }}>
            {kpis.map(k => (
              <div key={k.label} style={{
                background:'#1A1A18', border:'1px solid #2A2A27',
                borderRadius:18, padding:22,
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontSize:22 }}>{k.icon}</span>
                  <span style={{
                    fontSize:11, fontWeight:700, padding:'3px 10px',
                    borderRadius:20, background:'#1A2A1A', color:'#4CAF50',
                  }}>{k.change}</span>
                </div>
                <div style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:4 }}>{k.value}</div>
                <div style={{ fontSize:11, color:'#666', textTransform:'uppercase', letterSpacing:'1px', fontWeight:600 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

            {/* Recent Users */}
            <div style={{ background:'#1A1A18', border:'1px solid #2A2A27', borderRadius:18, overflow:'hidden' }}>
              <div style={{
                padding:'16px 20px', borderBottom:'1px solid #2A2A27',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <h3 style={{ color:'#ccc', fontSize:14, fontWeight:800 }}>Recent Users</h3>
                <Link to="/admin/users" style={{ fontSize:12, color:'#C4622D', textDecoration:'none' }}>View all →</Link>
              </div>
              {data?.recentUsers?.map(u => (
                <div key={u._id} style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'12px 20px', borderBottom:'1px solid #1E1E1C',
                }}>
                  <div style={{
                    width:34, height:34, borderRadius:'50%',
                    background:'#C4622D', display:'flex',
                    alignItems:'center', justifyContent:'center',
                    fontSize:13, fontWeight:800, color:'#fff', flexShrink:0,
                  }}>{u.name?.[0]?.toUpperCase() || '?'}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color:'#ddd', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize:11, color:'#555', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</div>
                  </div>
                  <span style={{
                    fontSize:10, fontWeight:700, padding:'2px 8px',
                    borderRadius:20, flexShrink:0,
                    background: u.role==='admin' ? '#2A2210' : '#1A2A1A',
                    color: u.role==='admin' ? '#D4A843' : '#4CAF50',
                  }}>{u.role}</span>
                </div>
              ))}
            </div>

            {/* Recent Searches */}
            <div style={{ background:'#1A1A18', border:'1px solid #2A2A27', borderRadius:18, overflow:'hidden' }}>
              <div style={{
                padding:'16px 20px', borderBottom:'1px solid #2A2A27',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <h3 style={{ color:'#ccc', fontSize:14, fontWeight:800 }}>Recent Searches</h3>
                <span style={{ fontSize:12, color:'#555' }}>Live</span>
              </div>
              {data?.recentSearches?.map((s, i) => (
                <div key={i} style={{
                  padding:'12px 20px', borderBottom:'1px solid #1E1E1C',
                }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:5 }}>
                    {s.ingredients?.slice(0,4).map(ing => (
                      <span key={ing} style={{
                        fontSize:10, background:'#2A2A27', color:'#aaa',
                        padding:'2px 8px', borderRadius:20,
                      }}>{ing}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:'#555' }}>
                    Found <b style={{ color:'#C4622D' }}>{s.resultCount}</b> recipes
                    {s.user && ` · ${s.user.name}`}
                    {' · '}{new Date(s.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick actions */}
          <div style={{ marginTop:24 }}>
            <h3 style={{ color:'#ccc', fontSize:14, fontWeight:800, marginBottom:16 }}>Quick Actions</h3>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[
                { label:'Add Recipe',     to:'/admin/recipes',     icon:'➕' },
                { label:'Add Ingredient', to:'/admin/ingredients', icon:'🥕' },
                { label:'View Users',     to:'/admin/users',       icon:'👥' },
                { label:'Go to App',      to:'/home',              icon:'🏠' },
              ].map(a => (
                <Link key={a.label} to={a.to} style={{
                  background:'#2A2A27', border:'1px solid #3A3A37',
                  borderRadius:12, padding:'12px 20px',
                  display:'flex', alignItems:'center', gap:8,
                  fontSize:13, fontWeight:700, color:'#ccc',
                  textDecoration:'none', transition:'all .2s',
                }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}