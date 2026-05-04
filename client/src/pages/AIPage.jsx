import { useState, useRef, useEffect } from "react";
import Header from "../components/layout/Header";
import { generateRecipe } from "../services/aiService";
import ChatBot from "../components/ai/ChatBot";
import Footer from "../components/layout/Footer";
const colorOptions = ["orange", "yellow", "green", "blue", "pink", "purple"];
import api from "../services/api";
export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [cuisine, setCuisine] = useState("Any");
  const [difficulty, setDiff] = useState("Any");
  const [maxTime, setMaxTime] = useState("Any");
  const [dietary, setDietary] = useState("None");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [colorTheme] = useState(
    () => colorOptions[Math.floor(Math.random() * colorOptions.length)],
  );
  const resultRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe what you have or want to cook.");
      return;
    }
    setError("");
    setLoading(true);
    setRecipe(null);
    try {
      const data = await generateRecipe({
        prompt,
        cuisine,
        difficulty,
        maxTime,
        dietary,
      });
      setRecipe(data.recipe);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    } catch (err) {
      setError(
        err.response?.data?.error || "AI generation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAIRecipe = async () => {
    if (!recipe || savingRecipe) return;
    setSavingRecipe(true);
    try {
      // First create the recipe in the database
      const { data: savedRecipe } = await api.post("/recipes", {
        ...recipe,
        isAIGenerated: true,
        colorTheme: colorTheme,
        tags: recipe.tags || [],
      });
      // Then save to user's saved list
      await api.post(`/users/saved/${savedRecipe._id}`);
      setRecipeSaved(true);
      showToast("❤️ Recipe saved to your collection!");
    } catch (err) {
      showToast("❌ Could not save recipe. Please try again.");
    } finally {
      setSavingRecipe(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
  };

  const colorMap = {
    yellow: "linear-gradient(135deg,#f0e8a0,#d4c050)",
    blue: "linear-gradient(135deg,#b8d4e8,#7aafe0)",
    green: "linear-gradient(135deg,#b8e8c4,#7aba8a)",
    pink: "linear-gradient(135deg,#f0c4c0,#e08880)",
    purple: "linear-gradient(135deg,#d4c0f0,#a880e0)",
    orange: "linear-gradient(135deg,#e8c49a,#d4956a)",
  };

  const examples = [
    "I have eggs, onion, cheese and leftover rice",
    "Chicken breast, garlic, lemon and fresh herbs",
    "Tomatoes, mozzarella, basil and olive oil",
    "Bananas, flour and some milk for breakfast",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2" }}>
      <Header />

      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            background: "#1C1C1A",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            padding: "12px 24px",
            borderRadius: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,.2)",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}

      {/* Hero */}
      <div
        style={{
          background: "#1C1C1A",
          padding: "52px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(196,98,45,.08)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(196,98,45,.2)",
              border: "1px solid rgba(196,98,45,.3)",
              padding: "6px 16px",
              borderRadius: 100,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "#E8876A",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              POWERED BY GOOGLE GEMINI
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px,5vw,52px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 12,
              letterSpacing: "-1px",
            }}
          >
            🤖 AI <span style={{ color: "#C4622D" }}>Chef</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#6A6A67",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Describe what ingredients you have and Gemini AI will generate a
            complete, professional recipe just for you — in seconds.
          </p>
        </div>
      </div>

      <main
        style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px 120px" }}
      >
        {/* Generator card */}
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #E0D8CC",
            borderRadius: 24,
            padding: 32,
            marginBottom: 24,
            boxShadow: "0 4px 16px rgba(0,0,0,.06)",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#1C1C1A",
              marginBottom: 6,
            }}
          >
            Generate a Custom Recipe
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#8A8578",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Tell the AI what ingredients you have, the cuisine you want, or any
            dietary preferences. Press{" "}
            <kbd
              style={{
                background: "#F5F0E8",
                border: "1px solid #E0D8CC",
                padding: "1px 6px",
                borderRadius: 4,
                fontSize: 11,
                color: "#8A8578",
              }}
            >
              Ctrl+Enter
            </kbd>{" "}
            to generate.
          </p>

          {/* Examples */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 11,
                color: "#8A8578",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: 8,
              }}
            >
              Quick examples:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  style={{
                    background: "#F5F0E8",
                    border: "1px solid #E0D8CC",
                    borderRadius: 100,
                    padding: "5px 13px",
                    fontSize: 11,
                    color: "#8A8578",
                    cursor: "pointer",
                    transition: "all .2s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#C4622D";
                    e.target.style.color = "#C4622D";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#E0D8CC";
                    e.target.style.color = "#8A8578";
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I have leftover chicken, some cream, mushrooms and pasta. I want something comforting and quick..."
            rows={4}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "1.5px solid #E0D8CC",
              borderRadius: 14,
              fontSize: 14,
              color: "#1C1C1A",
              background: "#FAF7F2",
              resize: "none",
              outline: "none",
              lineHeight: 1.6,
              fontFamily: "inherit",
              transition: "border-color .2s",
              marginBottom: 16,
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C4622D")}
            onBlur={(e) => (e.target.style.borderColor = "#E0D8CC")}
          />

          {/* Options grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {[
              [
                "Cuisine Style",
                cuisine,
                setCuisine,
                [
                  "Any",
                  "Italian",
                  "Asian",
                  "Indian",
                  "Mexican",
                  "French",
                  "Middle Eastern",
                  "American",
                  "Spanish",
                  "Greek",
                  "Japanese",
                  "Thai",
                ],
              ],
              [
                "Difficulty",
                difficulty,
                setDiff,
                ["Any", "Easy", "Medium", "Hard"],
              ],
              [
                "Max Time",
                maxTime,
                setMaxTime,
                ["Any", "15", "20", "30", "45", "60"],
              ],
              [
                "Dietary",
                dietary,
                setDietary,
                [
                  "None",
                  "Vegetarian",
                  "Vegan",
                  "Gluten-Free",
                  "Dairy-Free",
                  "Keto",
                  "Halal",
                ],
              ],
            ].map(([lbl, val, setter, opts]) => (
              <div key={lbl}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#2D2D2A",
                    marginBottom: 7,
                  }}
                >
                  {lbl}
                </label>
                <select
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1.5px solid #E0D8CC",
                    borderRadius: 10,
                    fontSize: 13,
                    background: "#fff",
                    color: "#1C1C1A",
                    outline: "none",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {opts.map((o) => (
                    <option key={o}>
                      {o === "Any" || o === "None" ? o : o}
                      {lbl === "Max Time" && o !== "Any" ? " min" : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                color: "#dc2626",
                fontSize: 13,
                padding: "12px 16px",
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              width: "100%",
              padding: 16,
              background: loading ? "#E0D8CC" : "#C4622D",
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontSize: 15,
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,.3)",
                    borderTopColor: "#fff",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Generating your recipe...
              </>
            ) : (
              "✨ Generate Recipe with Gemini AI"
            )}
          </button>

          <p
            style={{
              fontSize: 12,
              color: "#8A8578",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            Powered by Google Gemini 1.5 Flash · Free to use · Usually under 5
            seconds
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #E0D8CC",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 4px 16px rgba(0,0,0,.06)",
            }}
          >
            {[80, 60, 100, 60, 40].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 16,
                  background: "#F5F0E8",
                  borderRadius: 8,
                  width: `${w}%`,
                  marginBottom: 14,
                  animation: "pulse 1.5s ease infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Result card */}
        {recipe && !loading && (
          <div
            ref={resultRef}
            style={{
              background: "#fff",
              border: "1.5px solid #E0D8CC",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,.08)",
              animation: "fadeUp .4s ease",
            }}
          >
            {/* Result header */}
            <div
              style={{
                background: "#EEF6EF",
                borderBottom: "1.5px solid #C8DFC9",
                padding: "14px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#7A9E7E",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ✨ AI Generated Recipe
              </span>
              <span style={{ fontSize: 12, color: "#8A8578" }}>
                by Google Gemini
              </span>
            </div>

            {/* Hero image */}
            <div
              style={{
                height: 200,
                background: colorMap[colorTheme] || colorMap.orange,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 90,
              }}
            >
              {recipe.emoji || "🍽️"}
            </div>

            <div style={{ padding: "28px 32px 32px" }}>
              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                {[
                  ["✓ AI Created", "#EEF6EF", "#7A9E7E", "#C8DFC9"],
                  [recipe.cuisine, "#FDF0EC", "#C4622D", "#F0D0C0"],
                  [recipe.difficulty, "#FDF0EC", "#C4622D", "#F0D0C0"],
                  [
                    recipe.timeMinutes + " min",
                    "#FDF0EC",
                    "#C4622D",
                    "#F0D0C0",
                  ],
                ].map(([label, bg, col, border]) => (
                  <span
                    key={label}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "5px 14px",
                      borderRadius: 100,
                      background: bg,
                      color: col,
                      border: `1px solid ${border}`,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#1C1C1A",
                  marginBottom: 10,
                  letterSpacing: "-.5px",
                  lineHeight: 1.2,
                }}
              >
                {recipe.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#8A8578",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                {recipe.description}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  borderTop: "1.5px solid #E0D8CC",
                  borderBottom: "1.5px solid #E0D8CC",
                  padding: "16px 0",
                  marginBottom: 28,
                }}
              >
                {[
                  [recipe.timeMinutes + " min", "Time"],
                  [recipe.servings, "Servings"],
                  [recipe.calories + " kcal", "Calories"],
                  [recipe.ingredients?.length, "Ingredients"],
                ].map(([val, lbl]) => (
                  <div
                    key={lbl}
                    style={{
                      textAlign: "center",
                      borderRight: "1.5px solid #E0D8CC",
                      padding: "0 12px",
                    }}
                    className="last-no-border"
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#1C1C1A",
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#8A8578",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingredients + Steps */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.4fr",
                  gap: 28,
                  marginBottom: 24,
                }}
              >
                {/* Ingredients */}
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: "#1C1C1A",
                      marginBottom: 14,
                    }}
                  >
                    Ingredients
                  </h3>
                  {recipe.ingredients?.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "9px 0",
                        borderBottom: "1px solid #E0D8CC",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#2D2D2A", fontWeight: 500 }}>
                        {ing.name}
                      </span>
                      <span style={{ color: "#8A8578", fontSize: 12 }}>
                        {ing.amount}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: "#1C1C1A",
                      marginBottom: 14,
                    }}
                  >
                    Instructions
                  </h3>
                  {recipe.steps?.map((step, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: 12, marginBottom: 16 }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          background: "#1C1C1A",
                          color: "#fff",
                          borderRadius: "50%",
                          fontSize: 12,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#2D2D2A",
                          lineHeight: 1.7,
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro tip */}
              {recipe.tips && (
                <div
                  style={{
                    background: "#1C1C1A",
                    borderRadius: 16,
                    padding: "18px 22px",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.75)",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong style={{ color: "#D4A843" }}>Chef's Tip: </strong>
                    {recipe.tips}
                  </p>
                </div>
              )}

              {/* Tags */}
              {recipe.tags?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    marginBottom: 24,
                  }}
                >
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "#EDE6D6",
                        color: "#2D2D2A",
                        fontSize: 11,
                        padding: "4px 12px",
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {/* Save button */}
                <button
                  onClick={handleSaveAIRecipe}
                  disabled={savingRecipe || recipeSaved}
                  style={{
                    padding: "11px 20px",
                    background: recipeSaved ? "#7A9E7E" : "#C4622D",
                    color: "#fff",
                    border: "none",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: recipeSaved ? "default" : "pointer",
                    transition: "all .2s",
                    opacity: savingRecipe ? 0.7 : 1,
                  }}
                >
                  {savingRecipe
                    ? "Saving..."
                    : recipeSaved
                      ? "❤️ Saved!"
                      : "❤️ Save Recipe"}
                </button>

                <button
                  onClick={() => {
                    setRecipe(null);
                    setPrompt("");
                    setRecipeSaved(false);
                  }}
                  style={{
                    padding: "11px 20px",
                    background: "#1C1C1A",
                    color: "#fff",
                    border: "none",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background .2s",
                  }}
                >
                  🔄 Generate Another
                </button>

                <button
                  onClick={() => showToast("🖨️ Use Ctrl+P to print!")}
                  style={{
                    padding: "11px 20px",
                    background: "#F5F0E8",
                    color: "#1C1C1A",
                    border: "1.5px solid #E0D8CC",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  📤 Share
                </button>

                <button
                  onClick={() => setChatOpen(true)}
                  style={{
                    padding: "11px 20px",
                    background: "#FDF0EC",
                    color: "#C4622D",
                    border: "1.5px solid #F0D0C0",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  💬 Ask AI about this
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How it works — shown before first generation */}
        {!recipe && !loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 16,
              marginTop: 8,
            }}
          >
            {[
              [
                "✍️",
                "Describe it",
                "Tell the AI what ingredients you have or what kind of dish you want to make.",
              ],
              [
                "⚙️",
                "Set preferences",
                "Choose cuisine, difficulty, time limit, and dietary requirements.",
              ],
              [
                "🍽️",
                "Get your recipe",
                "Gemini generates a complete recipe with steps, tips, and nutrition info.",
              ],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                style={{
                  background: "#fff",
                  border: "1.5px solid #E0D8CC",
                  borderRadius: 20,
                  padding: "24px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#1C1C1A",
                    marginBottom: 8,
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 12, color: "#8A8578", lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Chatbot */}
      <ChatBot open={chatOpen} onToggle={() => setChatOpen((o) => !o)} />
      <Footer />
    </div>
  );
}
