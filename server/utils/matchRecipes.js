/**
 * PANTRY MATCHING ALGORITHM
 *
 * How scoring works:
 *  +2 per required ingredient the user HAS
 *  +1 per optional ingredient the user HAS
 *  -1 per required ingredient the user is MISSING
 *
 * A recipe only appears if user has >= 50% of required ingredients.
 * Results are sorted best match first.
 */

function matchRecipes(userIngredients, allRecipes) {
  // Normalise to lowercase for case-insensitive comparison
  const userSet = new Set(
    userIngredients.map((i) => i.toLowerCase().trim())
  );

  const results = allRecipes
    .map((recipe) => {
      const required = recipe.ingredients.filter((i) => !i.optional);
      const optional = recipe.ingredients.filter((i) => i.optional);

      const matchedRequired = required.filter((i) =>
        userSet.has(i.name.toLowerCase())
      );
      const missingRequired = required.filter(
        (i) => !userSet.has(i.name.toLowerCase())
      );
      const matchedOptional = optional.filter((i) =>
        userSet.has(i.name.toLowerCase())
      );

      const score =
        matchedRequired.length * 2 +
        matchedOptional.length * 1 -
        missingRequired.length * 1;

      const matchPercent =
        required.length > 0
          ? Math.round((matchedRequired.length / required.length) * 100)
          : 100;

      const isPerfectMatch = missingRequired.length === 0;

      return {
        recipe,
        score,
        matchPercent,
        isPerfectMatch,
        matchedIngredients: matchedRequired.map((i) => i.name),
        missingIngredients: missingRequired.map((i) => i.name),
      };
    })
    .filter((r) => r.matchPercent >= 50)
    .sort((a, b) => b.score - a.score);

  return results;
}

module.exports = matchRecipes;