import { useState } from 'react';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import Spinner from '../ui/Spinner';

export default function RecipeGrid({ results, loading, searched, count }) {
  const [selected, setSelected] = useState(null);

  if (loading) return (
    <div className="loading-state">
      <Spinner size="lg" />
      <p style={{color:'var(--muted)',fontSize:14}}>Finding recipes for you...</p>
    </div>
  );

  if (!searched) return (
    <div className="empty-state">
      <span className="emoji">🥘</span>
      <h3>Add ingredients to get started</h3>
      <p>Tell us what's in your kitchen and we'll find every recipe you can make right now.</p>
    </div>
  );

  if (!results.length) return (
    <div className="empty-state">
      <span className="emoji">😔</span>
      <h3>No recipes found</h3>
      <p>Try adding more ingredients or changing your filters.</p>
    </div>
  );

  return (
    <>
      <div className="recipe-grid">
        {results.map(result => (
          <RecipeCard key={result.recipe._id} result={result} onClick={() => setSelected(result)} />
        ))}
      </div>
      {selected && <RecipeModal result={selected} onClose={() => setSelected(null)} />}
    </>
  );
}