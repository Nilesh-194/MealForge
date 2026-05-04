import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/userService';
import Footer from '../components/layout/Footer';
export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDelete = async id => {
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(h => h._id !== id));
      showToast('Entry deleted');
    } catch { showToast('Error deleting'); }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all search history?')) return;
    try {
      await clearHistory();
      setHistory([]);
      showToast('History cleared');
    } catch { showToast('Error clearing history'); }
  };

  const handleRedo = ingredients => {
    sessionStorage.setItem('redoSearch', JSON.stringify(ingredients));
    navigate('/home');
  };

  const formatTime = d => {
    const diff = Date.now() - new Date(d);
    if (diff < 3600000)  return `${Math.round(diff/60000)} min ago`;
    if (diff < 86400000) return `${Math.round(diff/3600000)} hr ago`;
    return new Date(d).toLocaleDateString('en-IN', {day:'numeric',month:'short'});
  };

  const totalFound = history.reduce((a, h) => a + h.resultCount, 0);
  const best       = history.length ? Math.max(...history.map(h => h.resultCount)) : 0;

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

      <main style={{maxWidth:860, margin:'0 auto', padding:'48px 32px 80px'}}>

        {/* Page header */}
        <div style={{
          display:'flex', alignItems:'flex-start',
          justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:16,
        }}>
          <div>
            <h1 style={{fontSize:36, fontWeight:900, color:'#1C1C1A', letterSpacing:'-1px', marginBottom:6}}>
              🕐 Search History
            </h1>
            <p style={{fontSize:14, color:'#8A8578'}}>All your past ingredient searches.</p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClear} style={{
              background:'none', border:'1.5px solid #fecaca',
              color:'#ef4444', padding:'9px 20px',
              borderRadius:100, fontSize:13, fontWeight:700,
              cursor:'pointer', transition:'all .2s',
              marginTop:8,
            }}>🗑 Clear All</button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{display:'flex', justifyContent:'center', padding:'80px 0'}}>
            <div style={{
              width:44, height:44, borderRadius:'50%',
              border:'4px solid #E0D8CC', borderTopColor:'#C4622D',
              animation:'spin 1s linear infinite',
            }} />
          </div>
        )}

        {/* Empty state */}
        {!loading && !history.length && (
          <div style={{textAlign:'center', padding:'80px 40px'}}>
            <div style={{fontSize:72, marginBottom:20}}>🔍</div>
            <h3 style={{fontSize:22, fontWeight:800, color:'#1C1C1A', marginBottom:10}}>No searches yet</h3>
            <p style={{fontSize:14, color:'#8A8578', marginBottom:28}}>
              Your ingredient searches will appear here automatically.
            </p>
            <a href="/home" style={{
              background:'#C4622D', color:'#fff', padding:'12px 28px',
              borderRadius:100, fontSize:14, fontWeight:700, textDecoration:'none',
              display:'inline-block',
            }}>Start Searching →</a>
          </div>
        )}

        {!loading && history.length > 0 && (
          <>
            {/* Stats row */}
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(3,1fr)',
              gap:16, marginBottom:36,
            }}>
              {[
                [history.length, 'Total Searches', '#C4622D'],
                [totalFound,     'Recipes Found',  '#7A9E7E'],
                [best,           'Best Result',    '#D4A843'],
              ].map(([val, lbl, col]) => (
                <div key={lbl} style={{
                  background:'#fff', border:'1.5px solid #E0D8CC',
                  borderRadius:20, padding:'20px 16px', textAlign:'center',
                }}>
                  <div style={{fontSize:32, fontWeight:900, color:col, lineHeight:1}}>{val}</div>
                  <div style={{fontSize:11, color:'#8A8578', textTransform:'uppercase', letterSpacing:'1px', marginTop:8, fontWeight:600}}>{lbl}</div>
                </div>
              ))}
            </div>

            {/* History list */}
            <div style={{display:'flex', flexDirection:'column', gap:14}}>
              {history.map(item => (
                <div key={item._id} style={{
                  background:'#fff', border:'1.5px solid #E0D8CC',
                  borderRadius:20, padding:'20px 24px',
                  transition:'box-shadow .2s',
                  boxShadow:'0 2px 8px rgba(0,0,0,.04)',
                }}>
                  <div style={{
                    display:'flex', alignItems:'flex-start',
                    justifyContent:'space-between', gap:16, flexWrap:'wrap',
                  }}>
                    {/* Left — ingredient tags */}
                    <div style={{flex:1}}>
                      <div style={{display:'flex', flexWrap:'wrap', gap:7, marginBottom:10}}>
                        <span style={{fontSize:13, color:'#8A8578'}}>🔍</span>
                        {item.ingredients.map(ing => (
                          <span key={ing} style={{
                            fontSize:12, background:'#EDE6D6',
                            color:'#2D2D2A', padding:'4px 13px',
                            borderRadius:100, fontWeight:600,
                          }}>{ing}</span>
                        ))}
                      </div>
                      <div style={{fontSize:12, color:'#8A8578', display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
                        <span>Found <b style={{color:'#C4622D'}}>{item.resultCount} recipe{item.resultCount!==1?'s':''}</b></span>
                        <span style={{color:'#E0D8CC'}}>·</span>
                        <span>{formatTime(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Right — actions */}
                    <div style={{display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
                      <button
                        onClick={() => handleRedo(item.ingredients)}
                        style={{
                          background:'#1C1C1A', color:'#fff', border:'none',
                          padding:'9px 18px', borderRadius:100,
                          fontSize:12, fontWeight:700, cursor:'pointer',
                          transition:'background .2s', whiteSpace:'nowrap',
                        }}
                        onMouseEnter={e => e.target.style.background='#C4622D'}
                        onMouseLeave={e => e.target.style.background='#1C1C1A'}
                      >↩ Search Again</button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          background:'none', border:'1.5px solid #E0D8CC',
                          color:'#8A8578', padding:'8px 14px',
                          borderRadius:100, fontSize:12,
                          cursor:'pointer', transition:'all .2s',
                        }}
                        onMouseEnter={e => { e.target.style.borderColor='#ef4444'; e.target.style.color='#ef4444'; }}
                        onMouseLeave={e => { e.target.style.borderColor='#E0D8CC'; e.target.style.color='#8A8578'; }}
                      >✕</button>
                    </div>
                  </div>
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