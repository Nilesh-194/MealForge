import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import RecipeModal from '../components/recipes/RecipeModal';
import { getSavedRecipes, toggleSaveRecipe } from '../services/userService';
import Footer from '../components/layout/Footer';
const colorMap = {
  yellow:'linear-gradient(135deg,#f0e8a0,#d4c050)',
  blue:'linear-gradient(135deg,#b8d4e8,#7aafe0)',
  green:'linear-gradient(135deg,#b8e8c4,#7aba8a)',
  pink:'linear-gradient(135deg,#f0c4c0,#e08880)',
  purple:'linear-gradient(135deg,#d4c0f0,#a880e0)',
  orange:'linear-gradient(135deg,#e8c49a,#d4956a)',
  '':'linear-gradient(135deg,#c8a870,#a07840)',
};

// Convert a plain recipe into the result shape RecipeModal expects
function toResult(recipe) {
  return {
    recipe,
    isPerfectMatch: true,
    matchPercent: 100,
    matchedIngredients: recipe.ingredients?.map(i => i.name) || [],
    missingIngredients: [],
  };
}

export default function Saved() {
  const [recipes, setRecipes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState('');

  useEffect(() => {
    getSavedRecipes()
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleUnsave = async (id, e) => {
    e.stopPropagation(); // prevent card click
    try {
      await toggleSaveRecipe(id);
      setRecipes(prev => prev.filter(r => r._id !== id));
      if (selected?.recipe?._id === id) setSelected(null);
      showToast('Recipe removed from saved');
    } catch {
      showToast('Error removing recipe');
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#FAF7F2' }}>
      <Header />

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', top:24, left:'50%',
          transform:'translateX(-50%)', zIndex:500,
          background:'#1C1C1A', color:'#fff',
          fontSize:13, fontWeight:700,
          padding:'12px 24px', borderRadius:100,
          boxShadow:'0 8px 24px rgba(0,0,0,.2)',
          whiteSpace:'nowrap',
        }}>{toast}</div>
      )}

      <main style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px 80px' }}>

        {/* Page header */}
        <div style={{ marginBottom:40 }}>
          <h1 style={{
            fontSize:36, fontWeight:900, color:'#1C1C1A',
            letterSpacing:'-1px', marginBottom:8,
          }}>❤️ Saved Recipes</h1>
          <p style={{ fontSize:14, color:'#8A8578' }}>
            Your bookmarked recipes. Click any card to view the full recipe.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}>
            <div style={{
              width:44, height:44, borderRadius:'50%',
              border:'4px solid #E0D8CC', borderTopColor:'#C4622D',
              animation:'spin 1s linear infinite',
            }} />
          </div>
        )}

        {/* Empty state */}
        {!loading && !recipes.length && (
          <div style={{ textAlign:'center', padding:'80px 40px' }}>
            <div style={{ fontSize:72, marginBottom:20 }}>🍽️</div>
            <h3 style={{
              fontSize:22, fontWeight:800, color:'#1C1C1A', marginBottom:10,
            }}>No saved recipes yet</h3>
            <p style={{ fontSize:14, color:'#8A8578', marginBottom:28 }}>
              Browse recipes and hit the ❤️ button to save them here.
            </p>
            <a href="/home" style={{
              background:'#C4622D', color:'#fff',
              padding:'12px 28px', borderRadius:100,
              fontSize:14, fontWeight:700, textDecoration:'none',
              display:'inline-block',
            }}>Explore Recipes →</a>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <>
            <p style={{ fontSize:13, color:'#8A8578', marginBottom:24 }}>
              <b style={{ color:'#C4622D' }}>{recipes.length}</b> saved
              recipe{recipes.length !== 1 ? 's' : ''}
            </p>

            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',
              gap:20,
            }}>
              {recipes.map(recipe => (
                <div
                  key={recipe._id}
                  onClick={() => setSelected(toResult(recipe))}
                  style={{
                    background:'#fff',
                    border:'1.5px solid #E0D8CC',
                    borderRadius:20,
                    overflow:'hidden',
                    cursor:'pointer',
                    transition:'transform .25s, box-shadow .25s',
                    boxShadow:'0 2px 8px rgba(0,0,0,.05)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.05)';
                  }}
                >
                  {/* Card image */}
                  <div style={{
                    height:120,
                    background: colorMap[recipe.colorTheme] || colorMap[''],
                    display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:48,
                    position:'relative',
                  }}>
                    {recipe.emoji}

                    {/* Unsave button */}
                    <button
                      onClick={e => handleUnsave(recipe._id, e)}
                      title="Remove from saved"
                      style={{
                        position:'absolute', top:10, right:10,
                        background:'rgba(255,255,255,.9)',
                        border:'none', borderRadius:'50%',
                        width:30, height:30,
                        display:'flex', alignItems:'center',
                        justifyContent:'center',
                        cursor:'pointer', fontSize:14,
                        color:'#ef4444', transition:'background .2s',
                      }}
                    >✕</button>

                    {/* Perfect match badge */}
                    <div style={{
                      position:'absolute', top:10, left:10,
                      background:'rgba(255,255,255,.92)',
                      borderRadius:100, padding:'3px 10px',
                      fontSize:10, fontWeight:800, color:'#C4622D',
                    }}>❤️ Saved</div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding:'14px 16px 18px' }}>
                    <div style={{
                      fontSize:10, color:'#C4622D', fontWeight:700,
                      textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6,
                    }}>
                      {recipe.cuisine} · {recipe.difficulty}
                    </div>
                    <h3 style={{
                      fontSize:14, fontWeight:800, color:'#1C1C1A',
                      lineHeight:1.3, marginBottom:8,
                    }}>{recipe.title}</h3>
                    <p style={{ fontSize:12, color:'#8A8578', marginBottom:12 }}>
                      ⏱ {recipe.timeMinutes} min &nbsp;·&nbsp; {recipe.calories} kcal
                    </p>
                    <div style={{
                      width:'100%', padding:'8px',
                      background:'#1C1C1A', border:'none',
                      borderRadius:10, color:'#fff',
                      fontSize:12, fontWeight:700,
                      textAlign:'center',
                    }}>
                      View Full Recipe →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Recipe Modal */}
      {selected && (
        <RecipeModal
          result={selected}
          onClose={() => setSelected(null)}
        />
      )}
      <Footer />
    </div>
  );
}