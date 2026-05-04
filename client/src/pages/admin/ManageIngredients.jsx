import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

const CATEGORIES = ['Protein','Vegetable','Fruit','Dairy','Grain','Pantry','Spice','Herb','Condiment','Oil','Beverage','Nut','Legume','Seafood','Other'];
const EMPTY = { name:'', emoji:'🥄', category:'Other', aliases:'' };

export default function ManageIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(EMPTY);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState('');
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('All');

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const r = await api.get('/ingredients');
      setIngredients(r.data);
    } catch { showToast('Error loading ingredients'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchIngredients(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };

  const openEdit = ing => {
    setForm({ ...ing, aliases: ing.aliases?.join(', ') || '' });
    setEditing(ing._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this ingredient?')) return;
    try {
      await api.delete(`/ingredients/${id}`);
      showToast('✅ Ingredient deleted');
      fetchIngredients();
    } catch { showToast('❌ Error deleting'); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        aliases: typeof form.aliases === 'string'
          ? form.aliases.split(',').map(a => a.trim()).filter(Boolean)
          : form.aliases,
      };
      if (editing) {
        await api.put(`/ingredients/${editing}`, payload);
        showToast('✅ Ingredient updated');
      } else {
        await api.post('/ingredients', payload);
        showToast('✅ Ingredient added');
      }
      setShowForm(false);
      fetchIngredients();
    } catch (err) {
      showToast(err.response?.data?.error || '❌ Error saving');
    } finally { setSaving(false); }
  };

  const filtered = ingredients.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === 'All' || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const inputStyle = {
    width:'100%', padding:'9px 12px',
    border:'1px solid #2A2A27', borderRadius:8,
    background:'#0F0F0E', color:'#ddd', fontSize:13,
    outline:'none', fontFamily:'inherit',
  };

  const labelStyle = {
    display:'block', fontSize:11, fontWeight:700,
    color:'#888', textTransform:'uppercase', letterSpacing:'1px', marginBottom:6,
  };

  return (
    <AdminLayout title="Manage Ingredients">
      {toast && (
        <div style={{
          position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
          zIndex:999, background:'#1C1C1A', color:'#fff',
          fontSize:13, fontWeight:700, padding:'12px 24px',
          borderRadius:100, boxShadow:'0 8px 24px rgba(0,0,0,.4)',
        }}>{toast}</div>
      )}

      {/* Controls */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ingredients..."
            style={{ ...inputStyle, width:200 }}
          />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ ...inputStyle, width:160 }}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <span style={{ fontSize:13, color:'#555' }}>
            <b style={{ color:'#C4622D' }}>{filtered.length}</b> of {ingredients.length}
          </span>
        </div>
        <button onClick={openAdd} style={{
          background:'#C4622D', color:'#fff', border:'none',
          padding:'10px 20px', borderRadius:10, fontSize:13,
          fontWeight:700, cursor:'pointer',
        }}>+ Add Ingredient</button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', border:'4px solid #2A2A27', borderTopColor:'#C4622D', animation:'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
          gap:12,
        }}>
          {filtered.map(ing => (
            <div key={ing._id} style={{
              background:'#1A1A18', border:'1px solid #2A2A27',
              borderRadius:14, padding:16,
              display:'flex', flexDirection:'column', gap:10,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:24 }}>{ing.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:'#ddd', fontWeight:700, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ing.name}</div>
                  <div style={{
                    fontSize:10, fontWeight:700, color:'#C4622D',
                    background:'rgba(196,98,45,.15)', padding:'2px 8px',
                    borderRadius:20, display:'inline-block', marginTop:3,
                  }}>{ing.category}</div>
                </div>
              </div>
              {ing.aliases?.length > 0 && (
                <div style={{ fontSize:11, color:'#555', lineHeight:1.4 }}>
                  aka: {ing.aliases.slice(0,3).join(', ')}
                </div>
              )}
              <div style={{ display:'flex', gap:6, marginTop:'auto' }}>
                <button onClick={() => openEdit(ing)} style={{
                  flex:1, background:'#2A2A27', border:'none', color:'#aaa',
                  padding:'6px', borderRadius:8, fontSize:11, cursor:'pointer',
                }}>✏️ Edit</button>
                <button onClick={() => handleDelete(ing._id)} style={{
                  flex:1, background:'#2A1010', border:'none', color:'#F44336',
                  padding:'6px', borderRadius:8, fontSize:11, cursor:'pointer',
                }}>🗑 Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.8)',
          backdropFilter:'blur(4px)', zIndex:200,
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }} onClick={e => e.target===e.currentTarget && setShowForm(false)}>
          <div style={{
            background:'#1A1A18', border:'1px solid #2A2A27',
            borderRadius:24, width:'100%', maxWidth:480, padding:32,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 style={{ color:'#fff', fontSize:18, fontWeight:900 }}>
                {editing ? '✏️ Edit Ingredient' : '➕ Add Ingredient'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background:'#2A2A27', border:'none', color:'#888',
                width:32, height:32, borderRadius:'50%', fontSize:18, cursor:'pointer',
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} required value={form.name}
                    onChange={e => setForm(f => ({...f, name:e.target.value}))}
                    placeholder="e.g. Chicken" />
                </div>
                <div>
                  <label style={labelStyle}>Emoji</label>
                  <input style={inputStyle} value={form.emoji}
                    onChange={e => setForm(f => ({...f, emoji:e.target.value}))}
                    placeholder="🥕" />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category}
                    onChange={e => setForm(f => ({...f, category:e.target.value}))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>Aliases (comma separated)</label>
                  <input style={inputStyle} value={form.aliases}
                    onChange={e => setForm(f => ({...f, aliases:e.target.value}))}
                    placeholder="chicken breast, chicken thigh" />
                </div>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} style={{
                  flex:1, padding:13, background:'#C4622D', border:'none',
                  borderRadius:12, color:'#fff', fontSize:14, fontWeight:800,
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .6 : 1,
                }}>
                  {saving ? 'Saving...' : editing ? '✅ Update' : '✅ Add'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding:'13px 20px', background:'#2A2A27', border:'none',
                  borderRadius:12, color:'#888', fontSize:14, cursor:'pointer',
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}