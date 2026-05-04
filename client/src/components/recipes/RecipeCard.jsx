const colorMap = {
  yellow:'linear-gradient(135deg,#f0e8a0,#d4c050)',
  blue:'linear-gradient(135deg,#b8d4e8,#7aafe0)',
  green:'linear-gradient(135deg,#b8e8c4,#7aba8a)',
  pink:'linear-gradient(135deg,#f0c4c0,#e08880)',
  purple:'linear-gradient(135deg,#d4c0f0,#a880e0)',
  orange:'linear-gradient(135deg,#e8c49a,#d4956a)',
  '':'linear-gradient(135deg,#c8a870,#a07840)',
};

export default function RecipeCard({ result, onClick }) {
  const { recipe, matchPercent, isPerfectMatch, missingIngredients } = result;
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="card-img" style={{background: colorMap[recipe.colorTheme]||colorMap['']}}>
        {recipe.emoji}
        <div className={`match-badge ${isPerfectMatch?'perfect':'partial'}`}>
          {isPerfectMatch ? '✦ Perfect' : `${matchPercent}% match`}
        </div>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="cuisine">{recipe.cuisine}</span>
          {' · '}{recipe.difficulty}{' · '}⏱ {recipe.timeMinutes} min
        </div>
        <h3 className="card-title">{recipe.title}</h3>
        <div className="ing-pills">
          {recipe.ingredients.slice(0,3).map(i => (
            <span key={i.name} className={`ipill ${missingIngredients.includes(i.name)?'missing':''}`}>
              {missingIngredients.includes(i.name) ? '+ ' : ''}{i.name}
            </span>
          ))}
        </div>
        <button className="card-btn">View Recipe →</button>
      </div>
    </div>
  );
}