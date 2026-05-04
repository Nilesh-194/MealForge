import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState('');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const r = await api.get(`/users?page=${p}&limit=15`);
      setUsers(r.data.users);
      setTotal(r.data.total);
      setPage(p);
    } catch { showToast('Error loading users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/users/${id}/status`);
      setUsers(prev => prev.map(u =>
        u._id === id ? { ...u, isActive: !currentStatus } : u
      ));
      showToast(`✅ User ${currentStatus ? 'banned' : 'activated'}`);
    } catch { showToast('❌ Error updating user'); }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      setUsers(prev => prev.map(u =>
        u._id === id ? { ...u, role: newRole } : u
      ));
      showToast('✅ Role updated');
    } catch { showToast('❌ Error updating role'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    padding:'9px 12px', border:'1px solid #2A2A27', borderRadius:8,
    background:'#0F0F0E', color:'#ddd', fontSize:13,
    outline:'none', fontFamily:'inherit',
  };

  return (
    <AdminLayout title="Manage Users">
      {toast && (
        <div style={{
          position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
          zIndex:999, background:'#1C1C1A', color:'#fff',
          fontSize:13, fontWeight:700, padding:'12px 24px',
          borderRadius:100, boxShadow:'0 8px 24px rgba(0,0,0,.4)',
        }}>{toast}</div>
      )}

      {/* Controls */}
      <div style={{ display:'flex', gap:12, marginBottom:24, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ ...inputStyle, width:280 }}
          />
          <span style={{ fontSize:13, color:'#555' }}>
            <b style={{ color:'#C4622D' }}>{total}</b> total users
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', border:'4px solid #2A2A27', borderTopColor:'#C4622D', animation:'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ background:'#1A1A18', border:'1px solid #2A2A27', borderRadius:18, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#2A2A27' }}>
                {['User','Email','Role','Status','Joined','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'#888', fontSize:11, textTransform:'uppercase', letterSpacing:'1px', fontWeight:700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user._id} style={{ borderBottom:'1px solid #1E1E1C' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:34, height:34, borderRadius:'50%',
                        background: user.role==='admin' ? '#D4A843' : '#C4622D',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:13, fontWeight:800, color:'#fff', flexShrink:0,
                      }}>{user.name?.[0]?.toUpperCase() || '?'}</div>
                      <span style={{ color:'#ddd', fontWeight:600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#666', fontSize:12 }}>{user.email}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <select
                      value={user.role}
                      onChange={e => handleChangeRole(user._id, e.target.value)}
                      style={{
                        background:'#2A2A27', border:'1px solid #3A3A37',
                        color: user.role==='admin' ? '#D4A843' : '#aaa',
                        padding:'4px 8px', borderRadius:8, fontSize:12,
                        cursor:'pointer', fontFamily:'inherit',
                      }}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                      background: user.isActive ? '#1A2A1A' : '#2A1010',
                      color: user.isActive ? '#4CAF50' : '#F44336',
                    }}>{user.isActive ? 'Active' : 'Banned'}</span>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#555', fontSize:12 }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <button
                      onClick={() => handleToggleStatus(user._id, user.isActive)}
                      style={{
                        background: user.isActive ? '#2A1010' : '#1A2A1A',
                        border:'none',
                        color: user.isActive ? '#F44336' : '#4CAF50',
                        padding:'5px 12px', borderRadius:8,
                        fontSize:12, cursor:'pointer', fontWeight:700,
                      }}
                    >
                      {user.isActive ? '🚫 Ban' : '✅ Unban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{
            padding:'14px 20px', borderTop:'1px solid #2A2A27',
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <span style={{ fontSize:12, color:'#555' }}>Page {page}</span>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => fetchUsers(page-1)} disabled={page===1} style={{
                background:'#2A2A27', border:'none', color: page===1 ? '#444' : '#aaa',
                padding:'6px 14px', borderRadius:8, fontSize:12,
                cursor: page===1 ? 'not-allowed' : 'pointer',
              }}>← Prev</button>
              <button onClick={() => fetchUsers(page+1)} disabled={filtered.length < 15} style={{
                background:'#2A2A27', border:'none', color: filtered.length<15 ? '#444' : '#aaa',
                padding:'6px 14px', borderRadius:8, fontSize:12,
                cursor: filtered.length<15 ? 'not-allowed' : 'pointer',
              }}>Next →</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}