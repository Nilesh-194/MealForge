import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import IngredientSearch from '../components/ingredients/IngredientSearch';
import { getPantry, updatePantry } from '../services/userService';
import Footer from '../components/layout/Footer';
export default function Pantry() {
  const [pantry, setPantry]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPantry()
      .then(data => setPantry(data.personalPantry || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const addIngredient = ing => {
    if (!pantry.includes(ing.name)) setPantry(prev => [...prev, ing.name]);
  };

  const removeIngredient = name => setPantry(prev => prev.filter(i => i !== name));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePantry(pantry);
      showToast('✅ Pantry saved!');
    } catch { showToast('❌ Error saving pantry'); }
    finally { setSaving(false); }
  };

  const handleSearch = () => {
    sessionStorage.setItem('redoSearch', JSON.stringify(pantry));
    navigate('/home');
  };

  return (
    <div style={{minHeight:'100vh', background:'#FAF7F2'}}>
      <Header />

      {toast && (
        <div style={{
          position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
          zIndex:500, background:'#1C1C1A', color:'#fff',
          fontSize:13, fontWeight:700, padding:'12px 24px',
          borderRadius:100, boxShadow:'0 8px 24px rgba(0,0,0,.2)',
          whiteSpace:'nowrap',
        }}>{toast}</div>
      )}

      <main style={{maxWidth:640, margin:'0 auto', padding:'48px 32px 80px'}}>

        {/* Page header */}
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:36, fontWeight:900, color:'#1C1C1A', letterSpacing:'-1px', marginBottom:8}}>
            🥘 My Pantry
          </h1>
          <p style={{fontSize:14, color:'#8A8578', lineHeight:1.6}}>
            Save your usual kitchen staples here. One click to search recipes with everything you already own.
          </p>
        </div>

        {loading ? (
          <div style={{display:'flex', justifyContent:'center', padding:'60px 0'}}>
            <div style={{
              width:44, height:44, borderRadius:'50%',
              border:'4px solid #E0D8CC', borderTopColor:'#C4622D',
              animation:'spin 1s linear infinite',
            }} />
          </div>
        ) : (
          <>
            {/* Dark ingredient panel */}
            <div style={{
              background:'#1C1C1A', borderRadius:24,
              padding:28, marginBottom:20,
              position:'relative', overflow:'hidden',
            }}>
              {/* Decorative glow */}
              <div style={{
                position:'absolute', top:-60, right:-60,
                width:160, height:160, borderRadius:'50%',
                background:'rgba(196,98,45,.12)', pointerEvents:'none',
              }} />

              <p style={{
                fontSize:11, textTransform:'uppercase', letterSpacing:'2px',
                color:'#D4A843', fontWeight:700, marginBottom:18,
              }}>Your Pantry Ingredients</p>

              <IngredientSearch onAdd={addIngredient} selected={pantry} />

              {/* Tags */}
              <div style={{
                display:'flex', flexWrap:'wrap', gap:8,
                minHeight:44, margin:'18px 0 24px',
              }}>
                {pantry.length === 0 && (
                  <p style={{fontSize:12, color:'rgba(255,255,255,.25)'}}>
                    No ingredients yet. Search above to add some.
                  </p>
                )}
                {pantry.map(name => (
                  <span key={name} style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    background:'rgba(255,255,255,.1)',
                    border:'1.5px solid rgba(255,255,255,.15)',
                    color:'#fff', fontSize:12, fontWeight:500,
                    padding:'6px 14px', borderRadius:100,
                  }}>
                    {name}
                    <button
                      onClick={() => removeIngredient(name)}
                      style={{
                        background:'none', border:'none',
                        color:'rgba(255,255,255,.4)', fontSize:16,
                        lineHeight:1, padding:0, cursor:'pointer',
                        transition:'color .15s', marginLeft:2,
                      }}
                      onMouseEnter={e => e.target.style.color='#fff'}
                      onMouseLeave={e => e.target.style.color='rgba(255,255,255,.4)'}
                    >×</button>
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{display:'flex', gap:12}}>
                <button
                  onClick={handleSave} disabled={saving}
                  style={{
                    flex:1, padding:'14px', background:'#C4622D',
                    border:'none', borderRadius:14, color:'#fff',
                    fontSize:14, fontWeight:800, cursor:'pointer',
                    transition:'background .2s',
                    opacity: saving ? .6 : 1,
                  }}
                >
                  {saving ? 'Saving...' : '💾 Save Pantry'}
                </button>
                <button
                  onClick={handleSearch} disabled={!pantry.length}
                  style={{
                    flex:1, padding:'14px',
                    background:'rgba(255,255,255,.08)',
                    border:'1.5px solid rgba(255,255,255,.15)',
                    borderRadius:14, color:'#fff',
                    fontSize:14, fontWeight:700, cursor:'pointer',
                    transition:'background .2s',
                    opacity: !pantry.length ? .3 : 1,
                  }}
                >
                  🔍 Search with Pantry
                </button>
              </div>
            </div>

            {/* Count indicator */}
            {pantry.length > 0 && (
              <p style={{
                textAlign:'center', fontSize:13, color:'#8A8578', marginBottom:20,
              }}>
                <b style={{color:'#C4622D'}}>{pantry.length}</b> ingredient{pantry.length!==1?'s':''} in your pantry
              </p>
            )}

            {/* How it works */}
            <div style={{
              background:'#fff', border:'1.5px solid #E0D8CC',
              borderRadius:20, padding:'22px 26px',
            }}>
              <h3 style={{fontSize:14, fontWeight:800, color:'#1C1C1A', marginBottom:14, display:'flex', gap:8, alignItems:'center'}}>
                💡 How it works
              </h3>
              {[
                'Add ingredients you always have at home — oil, salt, onion, garlic etc.',
                'Hit Search with Pantry to instantly find every matching recipe.',
                'Your pantry is saved to your account — no need to re-enter every visit.',
              ].map(tip => (
                <div key={tip} style={{
                  display:'flex', gap:10, marginBottom:12, alignItems:'flex-start',
                }}>
                  <span style={{color:'#C4622D', fontWeight:800, marginTop:1}}>•</span>
                  <p style={{fontSize:13, color:'#8A8578', lineHeight:1.5}}>{tip}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}