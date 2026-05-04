import { useState, useRef, useEffect } from 'react';
import { searchIngredients } from '../../services/recipeService';

export default function IngredientSearch({ onAdd, selected }) {
  const [query, setQuery]   = useState('');
  const [suggs, setSuggs]   = useState([]);
  const [open, setOpen]     = useState(false);
  const [busy, setBusy]     = useState(false);
  const debounce            = useRef(null);
  const wrapRef             = useRef(null);

  useEffect(() => {
    const h = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleInput = val => {
    setQuery(val);
    clearTimeout(debounce.current);
    if (!val.trim()) { setSuggs([]); setOpen(false); return; }
    debounce.current = setTimeout(async () => {
      setBusy(true);
      try {
        const data = await searchIngredients(val);
        setSuggs(data.filter(i => !selected.includes(i.name)));
        setOpen(true);
      } catch { setSuggs([]); }
      finally { setBusy(false); }
    }, 280);
  };

  const add = ing => { onAdd(ing); setQuery(''); setSuggs([]); setOpen(false); };

  const handleKey = e => {
    if (e.key === 'Enter' && query.trim()) add({ name: query.trim(), emoji: '🥄' });
  };

  return (
    <div style={{position:'relative'}} ref={wrapRef}>
      <div className="ing-search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text" value={query}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search ingredients... or type & press Enter"
        />
        {busy && <span className="spinner-sm" />}
      </div>

      {open && suggs.length > 0 && (
        <div className="suggestions-box">
          {suggs.map(ing => (
            <div key={ing._id} className="sugg-item" onClick={() => add(ing)}>
              <span className="sugg-emoji">{ing.emoji}</span>
              <span className="sugg-name">{ing.name}</span>
              <span className="sugg-cat">{ing.category}</span>
              <button className="sugg-add">+ Add</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}