# 🍳 MealForge — Cook What You Have

> **Find recipes based on ingredients you already own. AI-powered, completely free.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-meal--forge--beta.vercel.app-C4622D?style=for-the-badge&logo=vercel)](https://meal-forge-beta.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Nilesh--194%2FMealForge-1C1C1A?style=for-the-badge&logo=github)](https://github.com/Nilesh-194/MealForge)
[![License](https://img.shields.io/badge/License-MIT-7A9E7E?style=for-the-badge)](LICENSE)

---

## 📸 Screenshots

| Landing | Home | AI Chef |
|---------|------|---------|
| ![Landing](https://via.placeholder.com/300x180/FAF7F2/C4622D?text=Landing) | ![Home](https://via.placeholder.com/300x180/1C1C1A/D4A843?text=Home) | ![AI](https://via.placeholder.com/300x180/FAF7F2/7A5FB0?text=AI+Chef) |

---

## ✨ Features

### 🔍 Smart Recipe Matching
Add ingredients you have at home and MealForge instantly finds every recipe you can make — ranked by match quality. Perfect matches first, partial matches after.

### 🤖 AI Chef (Powered by Google Gemini)
Describe what you have and our AI generates a completely custom recipe tailored to your ingredients, dietary preferences, cuisine style and time constraints.

### ❤️ Save & History
Bookmark your favourite recipes and access your complete search history. Re-run any past search with one click.

### 🥘 Personal Pantry
Save your kitchen staples (oil, salt, garlic etc.) once and search with them instantly — no re-entering every time.

### 💬 AI Cooking Assistant
A floating chatbot powered by Gemini for instant answers to cooking questions — substitutions, techniques, measurements, anything food related.

### 🛡️ Admin Panel
Full content management dashboard for administrators — manage recipes, ingredients, users, view live activity.

### 👤 Guest Mode
Browse and search recipes without creating an account. Sign up to unlock saving and AI features.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Framer Motion |
| **Backend** | Node.js, Express 4, REST API |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (Access + Refresh tokens), bcrypt, httpOnly cookies |
| **AI** | Google Gemini 2.5 Flash API |
| **Hosting** | Vercel (frontend) + Render (backend) |
| **Styling** | Pure CSS with CSS Variables, no framework |

---

## 📁 Project Structure

```
MealForge/
│
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   └── ChatBot.jsx      # Floating AI chat assistant
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── ingredients/
│   │   │   │   └── IngredientSearch.jsx  # Autocomplete search
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx       # Sticky nav with mobile hamburger
│   │   │   │   ├── Footer.jsx       # Site footer
│   │   │   │   └── AdminLayout.jsx  # Admin sidebar layout
│   │   │   ├── recipes/
│   │   │   │   ├── RecipeCard.jsx   # Recipe result card
│   │   │   │   ├── RecipeGrid.jsx   # Results grid with states
│   │   │   │   └── RecipeModal.jsx  # Full recipe detail modal
│   │   │   └── ui/
│   │   │       ├── Spinner.jsx
│   │   │       ├── Toast.jsx
│   │   │       └── ErrorBoundary.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── hooks/
│   │   │   ├── useRecipes.js        # Recipe search hook
│   │   │   └── useScrollAnimation.js # Intersection observer animations
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Public landing page
│   │   │   ├── Login.jsx            # Login + Signup tabs
│   │   │   ├── Signup.jsx           # Dedicated signup page
│   │   │   ├── Home.jsx             # Main ingredient search + results
│   │   │   ├── Saved.jsx            # Saved recipes
│   │   │   ├── History.jsx          # Search history
│   │   │   ├── Pantry.jsx           # Personal pantry
│   │   │   ├── AIPage.jsx           # AI recipe generator
│   │   │   ├── NotFound.jsx         # 404 page
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx    # Admin overview + stats
│   │   │       ├── ManageRecipes.jsx
│   │   │       ├── ManageIngredients.jsx
│   │   │       └── ManageUsers.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── recipeService.js
│   │   │   ├── userService.js
│   │   │   └── aiService.js
│   │   ├── App.jsx                  # Routes
│   │   ├── main.jsx
│   │   └── index.css                # All styles + CSS variables
│   ├── vercel.json                  # SPA routing fix
│   └── package.json
│
└── server/                          # Express Backend
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── controllers/
    │   ├── authController.js        # Signup, login, JWT, refresh
    │   ├── recipeController.js      # Recipe CRUD + matching
    │   ├── ingredientController.js
    │   ├── userController.js        # Profile, saved, history, pantry
    │   └── aiController.js          # Gemini integration
    ├── middleware/
    │   ├── auth.js                  # JWT verify middleware
    │   ├── adminOnly.js             # Role guard
    │   └── rateLimiter.js           # Express rate limiting
    ├── models/
    │   ├── User.js
    │   ├── Recipe.js
    │   ├── Ingredient.js
    │   └── SearchHistory.js
    ├── routes/
    │   ├── auth.js
    │   ├── recipes.js
    │   ├── ingredients.js
    │   ├── users.js
    │   └── ai.js
    ├── seed/
    │   └── seedData.js              # 200+ recipes, 200+ ingredients
    ├── utils/
    │   ├── matchRecipes.js          # Core matching algorithm
    │   └── generateToken.js         # JWT utilities
    └── index.js                     # Server entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Nilesh-194/MealForge.git
cd MealForge
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mealforge

# JWT secrets — use long random strings
JWT_SECRET=your_super_long_jwt_secret_here
JWT_REFRESH_SECRET=your_super_long_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Seed the database

```bash
node seed/seedData.js
```

Output:
```
✅ Seeded 200+ ingredients
✅ Seeded 200+ recipes
🎉 Database seeded successfully!
```

### 4. Set up the frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev
# → Server running on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev
# → App running on http://localhost:5173
```

### 6. Create an admin account

After signing up, run this to give your account admin access:

```bash
cd server
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOneAndUpdate(
    { email: 'YOUR_EMAIL_HERE' },
    { role: 'admin' },
    { new: true }
  );
  console.log('Admin set:', user.email);
  process.exit(0);
});
"
```

---

## 🧠 How the Matching Algorithm Works

```
User provides: ["Eggs", "Onion", "Cheese", "Salt"]
                        ↓
For each recipe in database:
  +2 points per required ingredient user HAS
  +1 point per optional ingredient user HAS
  -1 point per required ingredient user LACKS
                        ↓
Filter: only show recipes where user has ≥ 50% of required ingredients
                        ↓
Sort: highest score first
                        ↓
Return: [{recipe, matchPercent, isPerfectMatch, missingIngredients}]
```

---

## 🔐 Authentication Flow

```
SIGNUP                    LOGIN                     PROTECTED ROUTE
──────────                ──────────                ──────────────
POST /auth/signup         POST /auth/login          Request arrives
        ↓                         ↓                       ↓
Hash password             Verify password           Read Bearer token
(bcrypt, 12 rounds)               ↓                       ↓
        ↓                 Generate tokens           Verify JWT secret
Create User in DB                 ↓                       ↓
        ↓                 Access token (15m)        Attach user to req
Generate tokens           → Response body                  ↓
        ↓                 Refresh token (7d)        Allow or 401
Access token (15m)        → httpOnly cookie
→ Response body
Refresh token (7d)
→ httpOnly cookie
```

---

## 🌍 Deployment

### Frontend — Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `client` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Env Variable | `VITE_API_URL=https://your-backend.onrender.com/api` |

The `client/vercel.json` handles SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend — Render

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment Variables | All from `.env` file |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create account | Public |
| POST | `/api/auth/login` | Sign in | Public |
| POST | `/api/auth/guest` | Guest session | Public |
| POST | `/api/auth/refresh` | Refresh access token | Cookie |
| POST | `/api/auth/logout` | Sign out | 🔒 |
| GET | `/api/auth/me` | Current user | 🔒 |

### Recipes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/recipes/search?ingredients=Eggs,Onion` | Match recipes | Optional |
| GET | `/api/recipes/:id` | Single recipe | Public |
| GET | `/api/recipes/all` | All recipes (paginated) | 🛡️ Admin |
| POST | `/api/recipes` | Create recipe | 🛡️ Admin |
| PUT | `/api/recipes/:id` | Update recipe | 🛡️ Admin |
| DELETE | `/api/recipes/:id` | Delete recipe | 🛡️ Admin |

### Ingredients
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/ingredients/search?q=egg` | Autocomplete | Public |
| GET | `/api/ingredients` | All ingredients | Public |
| POST | `/api/ingredients` | Add ingredient | 🛡️ Admin |
| PUT | `/api/ingredients/:id` | Update | 🛡️ Admin |
| DELETE | `/api/ingredients/:id` | Delete | 🛡️ Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get profile | 🔒 |
| GET | `/api/users/saved` | Saved recipes | 🔒 |
| POST | `/api/users/saved/:id` | Toggle save | 🔒 |
| GET | `/api/users/history` | Search history | 🔒 |
| DELETE | `/api/users/history` | Clear history | 🔒 |
| GET | `/api/users/pantry` | Personal pantry | 🔒 |
| PUT | `/api/users/pantry` | Update pantry | 🔒 |

### AI
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/generate` | Generate recipe with Gemini | 🔒 |
| POST | `/api/ai/chat` | Cooking chatbot | 🔒 |
| POST | `/api/ai/suggest` | Recipe suggestions | 🔒 |

---

## 🗄️ Database Models

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed, bcrypt),
  role: 'user' | 'guest' | 'admin',
  savedRecipes: [ObjectId → Recipe],
  personalPantry: [String],
  isActive: Boolean,
  refreshToken: String,
  lastLogin: Date,
}
```

### Recipe
```js
{
  title: String,
  description: String,
  emoji: String,
  cuisine: String,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  timeMinutes: Number,
  servings: Number,
  calories: Number,
  ingredients: [{ name, amount, optional }],
  steps: [String],
  tags: [String],
  colorTheme: String,
  isApproved: Boolean,
  isAIGenerated: Boolean,
  saves: Number,
}
```

---

## 🔒 Security Features

- **Password hashing** — bcrypt with 12 salt rounds
- **JWT dual-token system** — short-lived access (15m) + long-lived refresh (7d)
- **httpOnly cookies** — refresh token inaccessible to JavaScript (XSS protection)
- **Rate limiting** — 10 auth attempts / 15 min, 20 AI requests / hour
- **CORS** — whitelist only your frontend URL
- **Helmet** — sets secure HTTP headers automatically
- **Input validation** — Mongoose schema validation on all inputs
- **Role-based access** — admin, user, guest tiers

---

## 🎯 Upcoming Features

- [ ] PWA support — installable on mobile
- [ ] Recipe ratings and reviews
- [ ] Weekly meal planner
- [ ] Shopping list generator from missing ingredients
- [ ] Social sharing — unique shareable URL per recipe
- [ ] Nutritional breakdown charts
- [ ] Email verification
- [ ] Forgot password flow
- [ ] Google OAuth login
- [ ] Recipe submission by users (with admin review)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nilesh Dubey**

[![GitHub](https://img.shields.io/badge/GitHub-Nilesh--194-1C1C1A?style=flat&logo=github)](https://github.com/Nilesh-194)

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/) — AI recipe generation
- [MongoDB Atlas](https://mongodb.com/atlas) — Cloud database
- [Vercel](https://vercel.com) — Frontend hosting
- [Render](https://render.com) — Backend hosting
- All the home cooks who inspired this project 🍳

---

<div align="center">
  <strong>Built with ❤️ on the MERN Stack</strong><br/>
  <sub>MongoDB · Express · React · Node.js</sub>
</div>
