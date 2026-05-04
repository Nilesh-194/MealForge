import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

const EMPTY_RECIPE = {
  title:'', description:'', emoji:'🍽️', cuisine:'', difficulty:'Easy',
  timeMinutes:30, servings:2, calories:0, colorTheme:'orange',
  ingredients:[{ name:'', amount:'', optional:false }],
  steps:[''], tags:'',
};

export default function ManageRecipes() {
  const [recipes, setRecipes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_RECIPE);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchRecipes = async (p = 1) => {
    setLoading(true);
    try {
      const r = await api.get(`/recipes/all?page=${p}&limit=15`);
      setRecipes(r.data.recipes);
      setTotal(r.data.total);
      setPage(p);
    } catch (err) { showToast('Error loading recipes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const openAdd = () => {
    setForm(EMPTY_RECIPE);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = recipe => {
    setForm({
      ...recipe,
      tags: recipe.tags?.join(', ') || '',
      ingredients: recipe.ingredients?.length ? recipe.ingredients : [{ name:'', amount:'', optional:false }],
      steps: recipe.steps?.length ? recipe.steps : [''],
    });
    setEditing(recipe._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      showToast('✅ Recipe deleted');
      fetchRecipes(page);
    } catch { showToast('❌ Error deleting recipe'); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string'
          ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
          : form.tags,
        ingredients: form.ingredients.filter(i => i.name.trim()),
        steps: form.steps.filter(s => s.trim()),
        timeMinutes: Number(form.timeMinutes),
        servings: Number(form.servings),
        calories: Number(form.calories),
      };
      if (editing) {
        await api.put(`/recipes/${editing}`, payload);
        showToast('✅ Recipe updated');
      } else {
        await api.post('/recipes', payload);
        showToast('✅ Recipe added');
      }
      setShowForm(false);
      fetchRecipes(page);
    } catch (err) {
      showToast(err.response?.data?.error || '❌ Error saving recipe');
    } finally { setSaving(false); }
  };

  const addIngredient = () => setForm(f => ({
    ...f, ingredients: [...f.ingredients, { name:'', amount:'', optional:false }]
  }));

  const removeIngredient = i => setForm(f => ({
    ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i)
  }));

  const updateIngredient = (i, field, val) => setForm(f => ({
    ...f,
    ingredients: f.ingredients.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing)
  }));

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, ''] }));
  const removeStep = i => setForm(f => ({ ...f, steps: f.steps.filter((_,idx) => idx!==i) }));
  const updateStep = (i, val) => setForm(f => ({
    ...f, steps: f.steps.map((s,idx) => idx===i ? val : s)
  }));

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  );

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
    <AdminLayout title="Manage Recipes">
      {toast && (
        <div style={{
          position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
          zIndex:999, background:'#1C1C1A', color:'#fff',
          fontSize:13, fontWeight:700, padding:'12px 24px',
          borderRadius:100, boxShadow:'0 8px 24px rgba(0,0,0,.4)',
          whiteSpace:'nowrap',
        }}>{toast}</div>
      )}

      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, gap:16, flexWrap:'wrap' }}>
        <div>
          <p style={{ color:'#555', fontSize:13 }}>
            <b style={{ color:'#C4622D' }}>{total}</b> total recipes in database
          </p>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes..."
            style={{ ...inputStyle, width:220 }}
          />
          <button onClick={openAdd} style={{
            background:'#C4622D', color:'#fff', border:'none',
            padding:'10px 20px', borderRadius:10, fontSize:13,
            fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
          }}>+ Add Recipe</button>
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
                {['Recipe','Cuisine','Difficulty','Time','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'#888', fontSize:11, textTransform:'uppercase', letterSpacing:'1px', fontWeight:700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(recipe => (
                <tr key={recipe._id} style={{ borderBottom:'1px solid #1E1E1C' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:20 }}>{recipe.emoji}</span>
                      <div>
                        <div style={{ color:'#ddd', fontWeight:600 }}>{recipe.title}</div>
                        <div style={{ fontSize:11, color:'#555' }}>{recipe.ingredients?.length} ingredients</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#888' }}>{recipe.cuisine}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                      background: recipe.difficulty==='Easy' ? '#1A2A1A' : recipe.difficulty==='Medium' ? '#2A2010' : '#2A1010',
                      color: recipe.difficulty==='Easy' ? '#4CAF50' : recipe.difficulty==='Medium' ? '#FF9800' : '#F44336',
                    }}>{recipe.difficulty}</span>
                  </td>
                  <td style={{ padding:'12px 16px', color:'#888' }}>⏱ {recipe.timeMinutes} min</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                      background: recipe.isApproved ? '#1A2A1A' : '#2A1010',
                      color: recipe.isApproved ? '#4CAF50' : '#F44336',
                    }}>{recipe.isApproved ? 'Active' : 'Hidden'}</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => openEdit(recipe)} style={{
                        background:'#2A2A27', border:'none', color:'#aaa',
                        padding:'5px 12px', borderRadius:8, fontSize:12,
                        cursor:'pointer', transition:'background .2s',
                      }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(recipe._id)} style={{
                        background:'#2A1010', border:'none', color:'#F44336',
                        padding:'5px 12px', borderRadius:8, fontSize:12,
                        cursor:'pointer', transition:'background .2s',
                      }}>🗑 Del</button>
                    </div>
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
            <span style={{ fontSize:12, color:'#555' }}>
              Showing {filtered.length} of {total}
            </span>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => fetchRecipes(page-1)} disabled={page===1} style={{
                background:'#2A2A27', border:'none', color: page===1 ? '#444' : '#aaa',
                padding:'6px 14px', borderRadius:8, fontSize:12, cursor: page===1 ? 'not-allowed' : 'pointer',
              }}>← Prev</button>
              <span style={{ fontSize:12, color:'#888', padding:'6px 10px' }}>Page {page}</span>
              <button onClick={() => fetchRecipes(page+1)} disabled={filtered.length < 15} style={{
                background:'#2A2A27', border:'none', color: filtered.length<15 ? '#444' : '#aaa',
                padding:'6px 14px', borderRadius:8, fontSize:12, cursor: filtered.length<15 ? 'not-allowed' : 'pointer',
              }}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.8)',
          backdropFilter:'blur(4px)', zIndex:200,
          display:'flex', alignItems:'flex-start', justifyContent:'center',
          padding:'32px 20px', overflowY:'auto',
        }} onClick={e => e.target===e.currentTarget && setShowForm(false)}>
          <div style={{
            background:'#1A1A18', border:'1px solid #2A2A27',
            borderRadius:24, width:'100%', maxWidth:720,
            padding:32, marginBottom:32,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <h2 style={{ color:'#fff', fontSize:20, fontWeight:900 }}>
                {editing ? '✏️ Edit Recipe' : '➕ Add New Recipe'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background:'#2A2A27', border:'none', color:'#888',
                width:32, height:32, borderRadius:'50%', fontSize:18, cursor:'pointer',
              }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic info */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} required value={form.title}
                    onChange={e => setForm(f => ({...f, title:e.target.value}))}
                    placeholder="Recipe name" />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight:70, resize:'none' }}
                    value={form.description}
                    onChange={e => setForm(f => ({...f, description:e.target.value}))}
                    placeholder="Brief description" />
                </div>
                <div>
                  <label style={labelStyle}>Emoji</label>
                  <input style={inputStyle} value={form.emoji}
                    onChange={e => setForm(f => ({...f, emoji:e.target.value}))}
                    placeholder="🍳" />
                </div>
                <div>
                  <label style={labelStyle}>Cuisine</label>
                  <input style={inputStyle} value={form.cuisine}
                    onChange={e => setForm(f => ({...f, cuisine:e.target.value}))}
                    placeholder="Italian, Asian, etc." />
                </div>
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select style={inputStyle} value={form.difficulty}
                    onChange={e => setForm(f => ({...f, difficulty:e.target.value}))}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Color Theme</label>
                  <select style={inputStyle} value={form.colorTheme}
                    onChange={e => setForm(f => ({...f, colorTheme:e.target.value}))}>
                    {['orange','yellow','green','blue','pink','purple',''].map(c => (
                      <option key={c} value={c}>{c || 'default'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Time (minutes)</label>
                  <input style={inputStyle} type="number" min={1} value={form.timeMinutes}
                    onChange={e => setForm(f => ({...f, timeMinutes:e.target.value}))} />
                </div>
                <div>
                  <label style={labelStyle}>Servings</label>
                  <input style={inputStyle} type="number" min={1} value={form.servings}
                    onChange={e => setForm(f => ({...f, servings:e.target.value}))} />
                </div>
                <div>
                  <label style={labelStyle}>Calories</label>
                  <input style={inputStyle} type="number" min={0} value={form.calories}
                    onChange={e => setForm(f => ({...f, calories:e.target.value}))} />
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} value={form.tags}
                    onChange={e => setForm(f => ({...f, tags:e.target.value}))}
                    placeholder="quick, vegetarian, healthy" />
                </div>
              </div>

              {/* Ingredients */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <label style={labelStyle}>Ingredients</label>
                  <button type="button" onClick={addIngredient} style={{
                    background:'#2A2A27', border:'none', color:'#C4622D',
                    padding:'4px 12px', borderRadius:8, fontSize:12, cursor:'pointer',
                  }}>+ Add</button>
                </div>
                {form.ingredients.map((ing, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
                    <input style={{ ...inputStyle, flex:2 }}
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={e => updateIngredient(i,'name',e.target.value)} />
                    <input style={{ ...inputStyle, flex:1.5 }}
                      placeholder="Amount (e.g. 2 cups)"
                      value={ing.amount}
                      onChange={e => updateIngredient(i,'amount',e.target.value)} />
                    <label style={{ display:'flex', alignItems:'center', gap:5, color:'#888', fontSize:12, whiteSpace:'nowrap', cursor:'pointer' }}>
                      <input type="checkbox" checked={ing.optional}
                        onChange={e => updateIngredient(i,'optional',e.target.checked)} />
                      Optional
                    </label>
                    <button type="button" onClick={() => removeIngredient(i)} style={{
                      background:'#2A1010', border:'none', color:'#F44336',
                      width:30, height:30, borderRadius:8, fontSize:16, cursor:'pointer', flexShrink:0,
                    }}>×</button>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <label style={labelStyle}>Steps</label>
                  <button type="button" onClick={addStep} style={{
                    background:'#2A2A27', border:'none', color:'#C4622D',
                    padding:'4px 12px', borderRadius:8, fontSize:12, cursor:'pointer',
                  }}>+ Add Step</button>
                </div>
                {form.steps.map((step, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
                    <div style={{
                      width:26, height:26, background:'#2A2A27', color:'#888',
                      borderRadius:'50%', display:'flex', alignItems:'center',
                      justifyContent:'center', fontSize:12, fontWeight:700,
                      flexShrink:0, marginTop:8,
                    }}>{i+1}</div>
                    <textarea
                      style={{ ...inputStyle, flex:1, minHeight:60, resize:'none' }}
                      placeholder={`Step ${i+1}`}
                      value={step}
                      onChange={e => updateStep(i, e.target.value)}
                    />
                    <button type="button" onClick={() => removeStep(i)} style={{
                      background:'#2A1010', border:'none', color:'#F44336',
                      width:30, height:30, borderRadius:8, fontSize:16,
                      cursor:'pointer', flexShrink:0, marginTop:6,
                    }}>×</button>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div style={{ display:'flex', gap:12 }}>
                <button type="submit" disabled={saving} style={{
                  flex:1, padding:14, background:'#C4622D', border:'none',
                  borderRadius:12, color:'#fff', fontSize:14, fontWeight:800,
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .6 : 1,
                }}>
                  {saving ? 'Saving...' : editing ? '✅ Update Recipe' : '✅ Add Recipe'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  padding:'14px 24px', background:'#2A2A27', border:'none',
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