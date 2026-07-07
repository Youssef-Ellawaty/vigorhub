"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus, Sparkles, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n";
import type { ChatMessage, Language, LoggedMealEntry, MealSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AIChatProps {
  lang: Language;
  isDark: boolean;
  onAddToLog: (entry: Omit<LoggedMealEntry, "id" | "addedAt">) => void;
}

const QUICK_PROMPTS = {
  en: [
    "Suggest a 400kcal high-protein breakfast with oats and eggs.",
    "I only have canned tuna and rice, what can I make?",
    "Give me a post-workout meal under 500 calories.",
    "What's a good high-protein snack under 200 calories?",
  ],
  ar: [
    "اقترح فطور شوفان وبيض في حدود 400 كالوري",
    "عندي تونة ورز بس، أعمل إيه؟",
    "اقترح وجبة بعد التمرين تحت 500 سعرة",
    "ما هي أفضل سناكة بروتين عالية تحت 200 سعرة؟",
  ],
};

const AI_RESPONSES_EN = [
  {
    prompt: "oats and eggs",
    response: `Great choice! Here's a high-protein oats & eggs breakfast around **400 kcal**:

**Oatmeal Power Bowl**

- 60g rolled oats (cooked in water) — 230 kcal
- 2 whole eggs (scrambled) — 155 kcal

**Macro Breakdown:**
| Item | Cal | Protein | Carbs | Fat |
|------|-----|---------|-------|-----|
| Oats 60g | 230 | 10g | 40g | 4g |
| 2 Eggs | 155 | 13g | 1g | 11g |
| **Total** | **385** | **23g** | **41g** | **15g** |

This combination gives you slow-release energy from oats and quality protein from eggs — perfect for muscle recovery!`,
    foods: [
      { name: "Rolled Oats (60g)", calories: 230, protein: 10, carbs: 40, fat: 4, quantity: "60g" },
      { name: "2 Whole Eggs", calories: 155, protein: 13, carbs: 1, fat: 11, quantity: "100g" },
    ],
  },
  {
    prompt: "tuna and rice",
    response: `Perfect pantry meal! Here's what you can make with canned tuna and rice:

**Tuna Rice Bowl**

- 150g cooked white rice — 195 kcal
- 100g canned tuna (drained) — 116 kcal

**Macro Breakdown:**
| Item | Cal | Protein | Carbs | Fat |
|------|-----|---------|-------|-----|
| Rice 150g | 195 | 4g | 42g | 0.5g |
| Tuna 100g | 116 | 26g | 0g | 1g |
| **Total** | **311** | **30g** | **42g** | **1.5g** |

High protein, low fat — excellent cutting meal!`,
    foods: [
      { name: "Cooked White Rice (150g)", calories: 195, protein: 4, carbs: 42, fat: 0.5, quantity: "150g" },
      { name: "Canned Tuna (100g)", calories: 116, protein: 26, carbs: 0, fat: 1, quantity: "100g" },
    ],
  },
  {
    prompt: "post-workout",
    response: `Excellent! Here's an optimal post-workout meal under 500 kcal:

**Chicken & Sweet Potato Recovery Meal**

- 150g grilled chicken breast — 248 kcal
- 150g sweet potato (baked) — 129 kcal

**Macro Breakdown:**
| Item | Cal | Protein | Carbs | Fat |
|------|-----|---------|-------|-----|
| Chicken 150g | 248 | 47g | 0g | 5g |
| Sweet Potato 150g | 129 | 2.5g | 30g | 0.2g |
| **Total** | **377** | **49.5g** | **30g** | **5.2g** |

The high protein supports muscle repair, while the sweet potato replenishes glycogen stores.`,
    foods: [
      { name: "Grilled Chicken Breast (150g)", calories: 248, protein: 47, carbs: 0, fat: 5, quantity: "150g" },
      { name: "Baked Sweet Potato (150g)", calories: 129, protein: 2.5, carbs: 30, fat: 0.2, quantity: "150g" },
    ],
  },
  {
    prompt: "snack",
    response: `Here are some excellent high-protein snacks under 200 kcal:

**Top Picks:**

1. **Greek Yogurt (170g)** — 100 kcal | 17g protein
2. **Canned Tuna (100g)** — 116 kcal | 26g protein ← Best option
3. **2 Hard-Boiled Eggs** — 155 kcal | 13g protein
4. **30g Almonds** — 174 kcal | 6g protein

**Macro Breakdown (Canned Tuna):**
| Cal | Protein | Carbs | Fat |
|-----|---------|-------|-----|
| 116 | 26g | 0g | 1g |

For maximum satiety and protein per calorie, canned tuna is the clear winner!`,
    foods: [
      { name: "Canned Tuna (100g)", calories: 116, protein: 26, carbs: 0, fat: 1, quantity: "100g" },
    ],
  },
];

const AI_RESPONSES_AR = [
  {
    prompt: "شوفان وبيض",
    response: `اختيار رائع! إليك فطور شوفان وبيض في حدود **400 كالوري** بروتين عالي:

**طبق الشوفان بالبيض**

- 60 جرام شوفان (مطبوخ بالماء) — 230 كيلوكالوري
- 2 بيضة كاملة (مخفوقة) — 155 كيلوكالوري

**توزيع الماكروز:**
| الصنف | كالوري | بروتين | كارب | دهون |
|-------|--------|--------|------|------|
| شوفان 60جم | 230 | 10جم | 40جم | 4جم |
| 2 بيضة | 155 | 13جم | 1جم | 11جم |
| **الإجمالي** | **385** | **23جم** | **41جم** | **15جم** |

طاقة ثابتة من الشوفان + بروتين عالي الجودة من البيض — مثالي لبناء العضلات!`,
    foods: [
      { name: "شوفان 60 جرام", calories: 230, protein: 10, carbs: 40, fat: 4, quantity: "60g" },
      { name: "2 بيضة كاملة", calories: 155, protein: 13, carbs: 1, fat: 11, quantity: "100g" },
    ],
  },
  {
    prompt: "تونة ورز",
    response: `وجبة مثالية من المطبخ! إليك ما يمكنك صنعه:

**طبق التونة والأرز**

- 150 جرام أرز أبيض مطبوخ — 195 كيلوكالوري
- 100 جرام تونة معلبة مصفاة — 116 كيلوكالوري

**توزيع الماكروز:**
| الصنف | كالوري | بروتين | كارب | دهون |
|-------|--------|--------|------|------|
| أرز 150جم | 195 | 4جم | 42جم | 0.5جم |
| تونة 100جم | 116 | 26جم | 0جم | 1جم |
| **الإجمالي** | **311** | **30جم** | **42جم** | **1.5جم** |

بروتين عالي ودهون منخفضة — وجبة تنشيف ممتازة!`,
    foods: [
      { name: "أرز أبيض مطبوخ 150 جم", calories: 195, protein: 4, carbs: 42, fat: 0.5, quantity: "150g" },
      { name: "تونة معلبة 100 جم", calories: 116, protein: 26, carbs: 0, fat: 1, quantity: "100g" },
    ],
  },
  {
    prompt: "بعد التمرين",
    response: `ممتاز! إليك وجبة مثالية بعد التمرين تحت 500 سعرة:

**وجبة التعافي - دجاج وبطاطا حلوة**

- 150 جرام صدر دجاج مشوي — 248 كيلوكالوري
- 150 جرام بطاطا حلوة مخبوزة — 129 كيلوكالوري

**توزيع الماكروز:**
| الصنف | كالوري | بروتين | كارب | دهون |
|-------|--------|--------|------|------|
| دجاج 150جم | 248 | 47جم | 0جم | 5جم |
| بطاطا 150جم | 129 | 2.5جم | 30جم | 0.2جم |
| **الإجمالي** | **377** | **49.5جم** | **30جم** | **5.2جم** |

البروتين العالي يدعم تعافي العضلات والبطاطا تعيد ملء مخازن الجليكوجين.`,
    foods: [
      { name: "صدر دجاج مشوي 150 جم", calories: 248, protein: 47, carbs: 0, fat: 5, quantity: "150g" },
      { name: "بطاطا حلوة مخبوزة 150 جم", calories: 129, protein: 2.5, carbs: 30, fat: 0.2, quantity: "150g" },
    ],
  },
  {
    prompt: "سناكة بروتين",
    response: `إليك أفضل السناكات البروتينية تحت 200 سعرة:

**الخيارات الأفضل:**

1. **زبادي يوناني (170جم)** — 100 كالوري | 17جم بروتين
2. **تونة معلبة (100جم)** — 116 كالوري | 26جم بروتين ← الأفضل
3. **2 بيضة مسلوقة** — 155 كالوري | 13جم بروتين
4. **لوز 30جم** — 174 كالوري | 6جم بروتين

**توزيع ماكروز التونة:**
| كالوري | بروتين | كارب | دهون |
|--------|--------|------|------|
| 116 | 26جم | 0جم | 1جم |

للحصول على أعلى بروتين بأقل سعرات، التونة هي الخيار الأمثل!`,
    foods: [
      { name: "تونة معلبة 100 جم", calories: 116, protein: 26, carbs: 0, fat: 1, quantity: "100g" },
    ],
  },
];

function simulateResponse(message: string, lang: "en" | "ar"): { content: string; foods: typeof AI_RESPONSES_EN[0]["foods"] } {
  const responses = lang === "ar" ? AI_RESPONSES_AR : AI_RESPONSES_EN;
  const lower = message.toLowerCase();

  for (const resp of responses) {
    if (lower.includes(resp.prompt.toLowerCase()) || resp.prompt.toLowerCase().includes(lower.split(" ")[0])) {
      return { content: resp.response, foods: resp.foods };
    }
  }

  // Default response
  const defaultEN = `Thanks for your question! As your AI nutrition coach, I can help you with:

- **Meal planning** based on your calorie & macro targets
- **Food swaps** and healthy alternatives
- **Recipe suggestions** from available ingredients
- **Nutrition timing** for workouts

Try asking me something like: *"Suggest a high-protein breakfast"* or *"I have chicken and broccoli, what can I cook?"*`;

  const defaultAR = `شكراً على سؤالك! كمساعد تغذية ذكي، يمكنني مساعدتك في:

- **تخطيط الوجبات** بناءً على أهداف السعرات والماكروز
- **بدائل غذائية** صحية
- **اقتراح وصفات** من المكونات المتاحة
- **توقيت التغذية** للتمارين

جرب سؤالي مثل: *"اقترح فطار بروتين عالي"* أو *"عندي دجاج وبروكلي، أعمل إيه؟"*`;

  return { content: lang === "ar" ? defaultAR : defaultEN, foods: [] };
}

export function AIChat({ lang, isDark, onAddToLog }: AIChatProps) {
  const isRTL = lang === "ar";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = QUICK_PROMPTS[lang];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate streaming delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const { content, foods } = simulateResponse(text, lang);

    // Stream word by word
    const assistantId = crypto.randomUUID();
    setIsTyping(false);

    const words = content.split(" ");
    let streamed = "";

    const streamingMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
      suggestedFoods: foods.length > 0 ? foods.map((f) => ({
        name: f.name,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        quantity: f.quantity,
      })) : undefined,
    };

    setMessages((prev) => [...prev, streamingMsg]);

    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 25));
      streamed += (i === 0 ? "" : " ") + words[i];
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: streamed, isStreaming: i < words.length - 1 } : m
        )
      );
    }
  }

  function handleAddFoods(foods: ChatMessage["suggestedFoods"]) {
    if (!foods) return;
    foods.forEach((food, i) => {
      const slots: MealSlot[] = ["breakfast", "lunch", "dinner", "snacks"];
      const meal: MealSlot = slots[i % slots.length];
      onAddToLog({
        foodItem: {
          id: `ai_${food.name.replace(/\s/g, "_")}_${i}`,
          nameEn: food.name,
          nameAr: food.name,
          type: "raw",
          caloriesPer: food.calories,
          proteinPer: food.protein,
          carbsPer: food.carbs,
          fatPer: food.fat,
          servingLabel: `per serving`,
        },
        meal,
        quantity: 1,
        totalCalories: food.calories,
        totalProtein: food.protein,
        totalCarbs: food.carbs,
        totalFat: food.fat,
      });
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border overflow-hidden",
        isDark
          ? "bg-slate-900/50 border-slate-700/40 backdrop-blur-md"
          : "bg-white/80 border-slate-200 backdrop-blur-md"
      )}
      style={{ height: "600px" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3.5 border-b flex-shrink-0",
          isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-100 bg-white/80"
        )}
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/25">
          <Sparkles className="h-4 w-4 text-white" />
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-current bg-emerald-400" style={{ borderColor: isDark ? '#0f172a' : '#fff' }} />
        </div>
        <div>
          <h3 className={cn("text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>
            {t(lang, "aiAssistantTitle")}
          </h3>
          <p className={cn("text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>
            Powered by Gemini AI · Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
              <Bot className="h-6 w-6 text-violet-400" />
            </div>
            <div className="text-center max-w-xs">
              <p className={cn("text-sm font-semibold mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                {lang === "ar" ? "مرحباً! أنا مساعدك الغذائي" : "Hello! I'm your nutrition AI"}
              </p>
              <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-500" : "text-slate-400")}>
                {lang === "ar"
                  ? "اسألني عن خطط الوجبات، التغذية، أو اقتراحات الطعام"
                  : "Ask me about meal plans, nutrition tips, or food suggestions"}
              </p>
            </div>
            {/* Quick prompts */}
            <div className="w-full space-y-2">
              <p className={cn("text-xs font-semibold text-center", isDark ? "text-slate-500" : "text-slate-400")}>
                {t(lang, "quickPrompts")}
              </p>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-start border transition-all",
                    isDark
                      ? "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-violet-500/30 hover:text-violet-300"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
                  )}
                >
                  <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
                  <span className="flex-1">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            {/* Avatar */}
            <div className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl mt-1",
              msg.role === "user"
                ? isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                : "bg-gradient-to-br from-violet-500/20 to-purple-600/20 text-violet-400"
            )}>
              {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            </div>

            <div className={cn("max-w-[85%] space-y-2", msg.role === "user" ? "items-end" : "items-start", "flex flex-col")}>
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? isDark
                      ? "bg-emerald-500/15 border border-emerald-500/20 text-slate-100"
                      : "bg-emerald-50 border border-emerald-200 text-slate-800"
                    : isDark
                    ? "bg-slate-800/70 border border-slate-700/50 text-slate-200"
                    : "bg-white border border-slate-200 text-slate-700 shadow-sm"
                )}
              >
                <FormattedMessage content={msg.content} isDark={isDark} />
                {msg.isStreaming && (
                  <span className="inline-flex ml-1 gap-0.5 align-middle">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                )}
              </div>

              {/* Add to logs button */}
              {msg.role === "assistant" && !msg.isStreaming && msg.suggestedFoods && msg.suggestedFoods.length > 0 && (
                <button
                  onClick={() => handleAddFoods(msg.suggestedFoods)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                >
                  <Plus className="h-3 w-3" />
                  {t(lang, "addToLogs")} ({msg.suggestedFoods.length} {lang === "ar" ? "عناصر" : "items"})
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 text-violet-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div
              className={cn(
                "rounded-2xl px-4 py-3 border",
                isDark ? "bg-slate-800/70 border-slate-700/50" : "bg-white border-slate-200"
              )}
            >
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn("h-1.5 w-1.5 rounded-full animate-bounce", isDark ? "bg-slate-400" : "bg-slate-400")}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className={cn(
          "flex-shrink-0 border-t p-3",
          isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-white/80"
        )}
      >
        {/* Quick prompts when there are messages */}
        {messages.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {quickPrompts.slice(0, 2).map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className={cn(
                  "flex-shrink-0 rounded-full px-3 py-1 text-xs border transition-all whitespace-nowrap",
                  isDark
                    ? "border-slate-700 text-slate-400 hover:border-violet-500/40 hover:text-violet-400"
                    : "border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600"
                )}
              >
                {prompt.length > 35 ? prompt.slice(0, 35) + "..." : prompt}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(lang, "aiPlaceholder")}
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-xl px-4 py-2.5 text-sm border transition-all",
              "focus:outline-none focus:ring-2 focus:ring-violet-500/40",
              "max-h-24",
              isDark
                ? "bg-slate-800/60 border-slate-700/50 text-slate-100 placeholder-slate-500"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
            )}
            style={{ scrollbarWidth: "thin" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all",
              input.trim() && !isTyping
                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                : isDark
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple markdown-like formatter for bold and tables
function FormattedMessage({ content, isDark }: { content: string; isDark: boolean }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Table row
        if (line.startsWith("|")) {
          const isHeader = lines[i + 1]?.startsWith("|---") || lines[i + 1]?.startsWith("|:---");
          const isSeparator = line.includes("---");
          if (isSeparator) return null;

          const cells = line.split("|").filter((c) => c.trim());
          return (
            <div key={i} className={cn("flex gap-2 text-[11px]", isHeader ? "font-bold" : "")}>
              {cells.map((cell, j) => (
                <span key={j} className={cn("flex-1", j === 0 ? "" : "text-center")}>
                  <RenderBold text={cell.trim()} />
                </span>
              ))}
            </div>
          );
        }

        // Headers
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-bold text-sm">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }

        // Bullet points
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-400 font-bold mt-0.5">·</span>
              <span><RenderBold text={line.slice(2)} /></span>
            </div>
          );
        }

        // Numbered list
        if (/^\d+\./.test(line)) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-400 font-bold">{line.match(/^\d+/)?.[0]}.</span>
              <span><RenderBold text={line.replace(/^\d+\.\s*/, "")} /></span>
            </div>
          );
        }

        if (!line.trim()) return <div key={i} className="h-1" />;

        return <p key={i}><RenderBold text={line} /></p>;
      })}
    </div>
  );
}

function RenderBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
