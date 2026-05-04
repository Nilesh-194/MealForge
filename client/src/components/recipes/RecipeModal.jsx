import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toggleSaveRecipe } from '../../services/userService';

const colorMap = {
  yellow:'linear-gradient(135deg,#f0e8a0,#d4c050)',
  blue:'linear-gradient(135deg,#b8d4e8,#7aafe0)',
  green:'linear-gradient(135deg,#b8e8c4,#7aba8a)',
  pink:'linear-gradient(135deg,#f0c4c0,#e08880)',
  purple:'linear-gradient(135deg,#d4c0f0,#a880e0)',
  orange:'linear-gradient(135deg,#e8c49a,#d4956a)',
  '':'linear-gradient(135deg,#c8a870,#a07840)',
};

export default function RecipeModal({ result, onClose }) {
  const { isGuest, isUser } = useAuth();
  const { recipe, isPerfectMatch, matchedIngredients, missingIngredients } = result;
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState('');

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await toggleSaveRecipe(recipe._id);
      setSaved(res.saved);
      setToast(res.saved ? '❤️ Recipe saved!' : '🗑️ Recipe removed');
      setTimeout(() => setToast(''), 2500);
    } catch { setToast('❌ Could not save'); setTimeout(() => setToast(''), 2500); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      {toast && <div className="toast">{toast}</div>}
      <div className="modal">
        {/* Hero */}
        <div className="modal-hero" style={{background: colorMap[recipe.colorTheme]||colorMap['']}}>
          {recipe.emoji}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Tags */}
          <div className="modal-tags">
            <span className="mtag terra">{recipe.difficulty}</span>
            <span className="mtag terra">{recipe.cuisine}</span>
            <span className="mtag terra">⏱ {recipe.timeMinutes} min</span>
            <span className={`mtag ${isPerfectMatch?'sage':'gold'}`}>
              {isPerfectMatch ? '✓ All Ingredients Available' : `${missingIngredients.length} ingredient(s) missing`}
            </span>
          </div>

          <h2 className="modal-title">{recipe.title}</h2>
          <p className="modal-desc">{recipe.description}</p>

          {/* Stats */}
          <div className="modal-stats">
            {[[recipe.timeMinutes+' min','Total Time'],[recipe.servings,'Servings'],[recipe.calories+' kcal','Per Serving'],[missingIngredients.length,'Missing']].map(([v,l]) => (
              <div className="mstat" key={l}>
                <div className="mstat-val">{v}</div>
                <div className="mstat-lbl">{l}</div>
              </div>
            ))}
          </div>

          {/* Ingredients + Steps */}
          <div className="modal-grid">
            <div>
              <h3 className="modal-sec-title">Ingredients</h3>
              {recipe.ingredients.map(ing => {
                const have = matchedIngredients.includes(ing.name);
                return (
                  <div className="ing-row" key={ing.name}>
                    <span className={have ? 'ing-name-have' : 'ing-name-need'}>
                      {ing.name}
                      {ing.optional && <span style={{fontSize:11,color:'var(--muted)',marginLeft:4}}>(opt)</span>}
                    </span>
                    <span className="ing-amt">{ing.amount}</span>
                  </div>
                );
              })}
            </div>
            <div>
              <h3 className="modal-sec-title">Instructions</h3>
              {recipe.steps.map((step,i) => (
                <div className="step-row" key={i}>
                  <div className="step-num">{i+1}</div>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="tips-bar">
            <span className="tip-icon">💡</span>
            <p>
              <strong>Pro Tip: </strong>
              {isPerfectMatch
                ? 'You have everything! Start cooking right now.'
                : `Pick up ${missingIngredients.slice(0,2).join(' and ')} to complete this recipe.`}
            </p>
          </div>

          {/* Save */}
          {isUser && (
            <button className={`save-btn ${saved?'saved':'unsaved'}`} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : saved ? '❤️ Saved!' : '❤️ Save Recipe'}
            </button>
          )}
          {isGuest && (
            <p className="guest-save">
              <a href="/signup">Sign up free</a> to save recipes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}