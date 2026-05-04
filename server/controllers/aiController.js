const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ─── GENERATE RECIPE ──────────────────────────────────────────────────────────
exports.generateRecipe = async (req, res, next) => {
  try {
    const { prompt, cuisine, difficulty, maxTime, dietary } = req.body;

    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ error: 'Please describe what you have or want to cook.' });
    }

    const systemPrompt = `
You are a professional chef and recipe creator. Generate a detailed, creative recipe based on the user's request.

User request: "${prompt}"
${cuisine && cuisine !== 'Any' ? `Cuisine style: ${cuisine}` : ''}
${difficulty && difficulty !== 'Any' ? `Difficulty level: ${difficulty}` : ''}
${maxTime && maxTime !== 'Any' ? `Maximum cooking time: ${maxTime} minutes` : ''}
${dietary && dietary !== 'None' ? `Dietary requirement: ${dietary}` : ''}

Respond ONLY with a valid JSON object in this exact format, no markdown, no backticks, no extra text:
{
  "title": "Recipe Name",
  "description": "A compelling 1-2 sentence description",
  "emoji": "single relevant emoji",
  "cuisine": "cuisine type",
  "difficulty": "Easy|Medium|Hard",
  "timeMinutes": number,
  "servings": number,
  "calories": number,
  "ingredients": [
    { "name": "ingredient name", "amount": "quantity and unit" }
  ],
  "steps": [
    "Step 1 description",
    "Step 2 description"
  ],
  "tips": "One professional cooking tip for this recipe",
  "tags": ["tag1", "tag2", "tag3"]
}
`;

    const result = await model.generateContent(systemPrompt);
    const text   = result.response.text().trim();

    // Strip markdown code blocks if present
    const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();

    let recipe;
    try {
      recipe = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: 'AI returned an invalid response. Please try again.' });
    }

    res.json({ recipe, generated: true });
  } catch (err) {
    if (err.message?.includes('API_KEY')) {
      return res.status(500).json({ error: 'AI service configuration error.' });
    }
    next(err);
  }
};

// ─── CHAT ─────────────────────────────────────────────────────────────────────
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const systemContext = `You are Pantry AI, a friendly and knowledgeable cooking assistant. 
You help users with:
- Recipe suggestions and ideas
- Ingredient substitutions
- Cooking techniques and tips
- Food pairings
- Kitchen measurements and conversions
- Dietary advice

Keep responses concise, helpful, and friendly. Use emojis occasionally to be engaging.
If asked about something unrelated to cooking or food, politely redirect to cooking topics.`;

    // Build conversation history for context
    const conversationHistory = history
      .slice(-6) // Keep last 6 messages for context
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${systemContext}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ''}
User: ${message}
Assistant:`;

    const result  = await model.generateContent(fullPrompt);
    const reply   = result.response.text().trim();

    res.json({ reply });
  } catch (err) {
    next(err);
  }
};

// ─── SUGGEST RECIPES ──────────────────────────────────────────────────────────
exports.suggestRecipes = async (req, res, next) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients?.length) {
      return res.status(400).json({ error: 'Please provide ingredients.' });
    }

    const prompt = `Given these ingredients: ${ingredients.join(', ')}

Suggest 3 creative recipe ideas. Respond ONLY with a valid JSON array, no markdown:
[
  {
    "title": "Recipe Name",
    "description": "One sentence description",
    "emoji": "emoji",
    "timeMinutes": number,
    "difficulty": "Easy|Medium|Hard",
    "missingIngredients": ["ingredient1"]
  }
]`;

    const result    = await model.generateContent(prompt);
    const text      = result.response.text().trim();
    const clean     = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    const suggestions = JSON.parse(clean);

    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};