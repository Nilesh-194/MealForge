import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import IngredientSearch from '../components/ingredients/IngredientSearch';
import RecipeGrid from '../components/recipes/RecipeGrid';
import { useRecipes } from '../hooks/useRecipes';
import Footer from '../components/layout/Footer';

const CUISINES    = ['All','Italian','Asian','Indian','Mexican','French','Middle Eastern','American','Spanish','Greek'];
const DIFFICULTIES = ['All','Easy','Medium','Hard'];

export default function Home() {
  const [ingredients, setIngredients]   = useState([]);
  const [cuisine, setCuisine]           = useState('All');
  const [difficulty, setDifficulty]     = useState('All');
  const [activeFilter, setActiveFilter] = useState('Best Match');
  const { results, loading, searched, count, findRecipes } = useRecipes();

  useEffect(() => {
    const redo = sessionStorage.getItem('redoSearch');
    if (redo) {
      const ings = JSON.parse(redo);
      setIngredients(ings.map(name => ({ name, emoji: '🥄' })));
      sessionStorage.removeItem('redoSearch');
      setTimeout(() => findRecipes(ings), 300);
    }
  }, []);

  const addIngredient = (ing) => {
    if (!ingredients.find(i => i.name === ing.name))
      setIngredients(prev => [...prev, ing]);
  };

  const removeIngredient = (name) =>
    setIngredients(prev => prev.filter(i => i.name !== name));

  const handleSearch = () => {
    if (!ingredients.length) return;
    const filters = {};
    if (cuisine !== 'All')    filters.cuisine    = cuisine;
    if (difficulty !== 'All') filters.difficulty = difficulty;
    findRecipes(ingredients.map(i => i.name), filters);
  };

  const tagColors = ['terra','sage','','terra','sage',''];

  return (
    <div className="home-page">
      <Header />
      <main className="home-main">

        {/* Hero Row */}
        <div className="home-hero">
          {/* Left */}
          <div className="animate-fadeUp">
            <h1 className="home-headline">Cook what you<br /><em>already have.</em></h1>
            <p className="home-sub">Add ingredients from your kitchen and we'll find every recipe you can make right now — ranked by best match.</p>

            <p className="filter-label">Cuisine</p>
            <div className="chip-row">
              {CUISINES.map(c => (
                <button key={c} className={`chip ${cuisine===c?'active':''}`} onClick={() => setCuisine(c)}>{c}</button>
              ))}
            </div>

            <p className="filter-label" style={{marginTop:16}}>Difficulty</p>
            <div className="chip-row">
              {DIFFICULTIES.map(d => (
                <button key={d} className={`chip ${difficulty===d?'active':''}`} onClick={() => setDifficulty(d)}>{d}</button>
              ))}
            </div>
          </div>

          {/* Right — Ingredient Panel */}
          <div className="ing-panel animate-fadeUp" style={{animationDelay:'.1s'}}>
            <p className="panel-label">🥘 What's in your kitchen?</p>

            <IngredientSearch onAdd={addIngredient} selected={ingredients.map(i=>i.name)} />

            <div style={{marginTop:16}}>
              <p className="tags-label">Your Ingredients</p>
              <div className="tags-wrap">
                {ingredients.map((ing, idx) => (
                  <span key={ing.name} className={`ing-tag ${tagColors[idx%tagColors.length]}`}>
                    {ing.emoji} {ing.name}
                    <button className="remove-btn" onClick={() => removeIngredient(ing.name)}>×</button>
                  </span>
                ))}
                {!ingredients.length && <span className="no-ings">No ingredients added yet</span>}
              </div>
            </div>

            <button className="find-btn" onClick={handleSearch} disabled={!ingredients.length || loading}>
              {loading
                ? <><span className="spinner-sm" />Finding recipes...</>
                : '✦ Find All Possible Recipes'}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="results-header">
            <div>
              <h2 className="results-title">Found <span>{count} recipes</span> for you</h2>
              <p className="results-meta">
                <b>{results.filter(r=>r.isPerfectMatch).length} perfect matches</b>
                {' · '}
                {results.filter(r=>!r.isPerfectMatch).length} partial matches
              </p>
            </div>
            <div className="filter-row">
              {['Best Match','Quickest','Easiest','Popular'].map(f => (
                <button key={f} className={`fchip ${activeFilter===f?'active':''}`} onClick={() => setActiveFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
        )}

        <RecipeGrid results={results} loading={loading} searched={searched} count={count} />

      </main>
      <Footer />
    </div>
  );
}