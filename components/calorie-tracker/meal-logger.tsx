"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  ChevronDown,
  Coffee,
  Sun,
  Moon,
  Cookie,
  X,
  Check,
  Package,
  Scale,
} from "lucide-react";
import { FOOD_DATABASE } from "@/lib/calorie-tracker/food-data";
import { t } from "@/lib/calorie-tracker/i18n";
import type { MealSlot, LoggedMealEntry, FoodItem, Language } from "@/lib/calorie-tracker/types";
import { cn } from "@/lib/utils";

interface MealLoggerProps {
  lang: Language;
  isDark: boolean;
  entries: LoggedMealEntry[];
  onAdd: (entry: Omit<LoggedMealEntry, "id" | "addedAt">) => void;
  onDelete: (id: string) => void;
}

const MEAL_SLOTS: {
  id: MealSlot;
  labelKey: "breakfast" | "lunch" | "dinner" | "snacks";
  icon: typeof Coffee;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: "breakfast",
    labelKey: "breakfast",
    icon: Coffee,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    id: "lunch",
    labelKey: "lunch",
    icon: Sun,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    id: "dinner",
    labelKey: "dinner",
    icon: Moon,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    id: "snacks",
    labelKey: "snacks",
    icon: Cookie,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
];

function AddFoodPanel({
  meal,
  lang,
  isDark,
  onAdd,
  onClose,
}: {
  meal: MealSlot;
  lang: Language;
  isDark: boolean;
  onAdd: (entry: Omit<LoggedMealEntry, "id" | "addedAt">) => void;
  onClose: () => void;
}) {
  const isRTL = lang === "ar";
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("100");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = FOOD_DATABASE.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.nameEn.toLowerCase().includes(q) ||
      f.nameAr.includes(q)
    );
  });

  const previewMacros = selectedFood && parseFloat(quantity) > 0
    ? {
        calories: Math.round((selectedFood.caloriesPer * parseFloat(quantity)) / (selectedFood.type === "raw" ? 100 : 1)),
        protein: Math.round((selectedFood.proteinPer * parseFloat(quantity)) / (selectedFood.type === "raw" ? 100 : 1) * 10) / 10,
        carbs: Math.round((selectedFood.carbsPer * parseFloat(quantity)) / (selectedFood.type === "raw" ? 100 : 1) * 10) / 10,
        fat: Math.round((selectedFood.fatPer * parseFloat(quantity)) / (selectedFood.type === "raw" ? 100 : 1) * 10) / 10,
      }
    : null;

  function handleAdd() {
    if (!selectedFood || !previewMacros) return;
    onAdd({
      foodItem: selectedFood,
      meal,
      quantity: parseFloat(quantity),
      totalCalories: previewMacros.calories,
      totalProtein: previewMacros.protein,
      totalCarbs: previewMacros.carbs,
      totalFat: previewMacros.fat,
    });
    onClose();
  }

  const inputClass = cn(
    "w-full rounded-xl px-3 py-2.5 text-sm font-medium border transition-all",
    "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
    isDark
      ? "bg-slate-800/60 border-slate-700/50 text-slate-100 placeholder-slate-500"
      : "bg-white/80 border-slate-200 text-slate-800 placeholder-slate-400"
  );

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 space-y-3 mt-3",
        isDark ? "bg-slate-900/70 border-slate-700/50" : "bg-slate-50 border-slate-200"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Food search / select */}
      <div className="relative">
        <div className="relative">
          <Search className={cn("absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5", isRTL ? "right-3" : "left-3", isDark ? "text-slate-500" : "text-slate-400")} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder={t(lang, "searchFood")}
            className={cn(inputClass, isRTL ? "pr-9" : "pl-9")}
          />
          {selectedFood && (
            <button
              onClick={() => { setSelectedFood(null); setSearch(""); }}
              className={cn("absolute top-1/2 -translate-y-1/2", isRTL ? "left-3" : "right-3")}
            >
              <X className="h-3.5 w-3.5 text-slate-400" />
            </button>
          )}
        </div>

        {dropdownOpen && !selectedFood && (
          <div
            className={cn(
              "absolute z-20 top-full mt-1 w-full rounded-xl border overflow-hidden shadow-xl max-h-48 overflow-y-auto",
              isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
            )}
          >
            {filtered.length === 0 ? (
              <p className={cn("px-3 py-2.5 text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                No results
              </p>
            ) : (
              filtered.map((food) => (
                <button
                  key={food.id}
                  onClick={() => {
                    setSelectedFood(food);
                    setSearch(lang === "ar" ? food.nameAr : food.nameEn);
                    setDropdownOpen(false);
                    setQuantity(food.type === "raw" ? "100" : "1");
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-start",
                    isDark
                      ? "hover:bg-slate-800 text-slate-300"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px]",
                      food.type === "raw"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-purple-500/10 text-purple-400"
                    )}
                  >
                    {food.type === "raw" ? <Scale className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{lang === "ar" ? food.nameAr : food.nameEn}</p>
                    <p className={cn("text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>
                      {food.caloriesPer} kcal {food.servingLabel}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected food info */}
      {selectedFood && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg p-2 border",
            isDark ? "bg-emerald-500/5 border-emerald-500/15" : "bg-emerald-50 border-emerald-200"
          )}
        >
          <div className={cn("flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md", selectedFood.type === "raw" ? "bg-emerald-500/20" : "bg-purple-500/20")}>
            {selectedFood.type === "raw" ? <Scale className="h-3 w-3 text-emerald-400" /> : <Package className="h-3 w-3 text-purple-400" />}
          </div>
          <div className="flex-1">
            <p className={cn("text-xs font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>
              {lang === "ar" ? selectedFood.nameAr : selectedFood.nameEn}
            </p>
            <p className={cn("text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>
              {selectedFood.caloriesPer} kcal · {selectedFood.servingLabel}
            </p>
          </div>
        </div>
      )}

      {/* Quantity */}
      {selectedFood && (
        <div>
          <label className={cn("block text-xs font-semibold mb-1.5", isDark ? "text-slate-400" : "text-slate-500")}>
            {selectedFood.type === "raw" ? t(lang, "quantityGrams") : t(lang, "quantityUnits")}
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
            min={selectedFood.type === "raw" ? "1" : "0.5"}
            step={selectedFood.type === "raw" ? "10" : "0.5"}
            placeholder={selectedFood.type === "raw" ? "100" : "1"}
          />
        </div>
      )}

      {/* Preview macros */}
      {previewMacros && (
        <div
          className={cn(
            "grid grid-cols-4 gap-2 rounded-xl p-3 border",
            isDark ? "bg-slate-800/50 border-slate-700/30" : "bg-white border-slate-200"
          )}
        >
          {[
            { label: "Cal", value: previewMacros.calories, unit: "kcal", color: "text-emerald-400" },
            { label: "Pro", value: previewMacros.protein, unit: "g", color: "text-cyan-400" },
            { label: "Carb", value: previewMacros.carbs, unit: "g", color: "text-yellow-400" },
            { label: "Fat", value: previewMacros.fat, unit: "g", color: "text-orange-400" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="text-center">
              <p className={cn("text-sm font-bold", color)}>{value}</p>
              <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className={cn(
            "flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-colors",
            isDark
              ? "border-slate-700 text-slate-400 hover:bg-slate-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-100"
          )}
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          disabled={!previewMacros}
          className={cn(
            "flex-[2] rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all",
            !previewMacros
              ? isDark ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35"
          )}
        >
          <Check className="h-4 w-4" />
          {t(lang, "addToMeal")}
        </button>
      </div>
    </div>
  );
}

export function MealLogger({ lang, isDark, entries, onAdd, onDelete }: MealLoggerProps) {
  const isRTL = lang === "ar";
  const [activeMeal, setActiveMeal] = useState<MealSlot | null>(null);

  function getMealEntries(meal: MealSlot) {
    return entries.filter((e) => e.meal === meal);
  }

  function getMealTotals(meal: MealSlot) {
    const mealEntries = getMealEntries(meal);
    return mealEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.totalCalories,
        protein: acc.protein + e.totalProtein,
        carbs: acc.carbs + e.totalCarbs,
        fat: acc.fat + e.totalFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      {MEAL_SLOTS.map(({ id, labelKey, icon: Icon, color, bgColor, borderColor }) => {
        const mealEntries = getMealEntries(id);
        const mealTotals = getMealTotals(id);
        const isAddingToThisMeal = activeMeal === id;

        return (
          <div
            key={id}
            className={cn(
              "rounded-2xl border transition-all duration-200",
              isDark
                ? "bg-slate-900/50 border-slate-700/40 backdrop-blur-md"
                : "bg-white/80 border-slate-200 backdrop-blur-md"
            )}
          >
            {/* Meal Header */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", bgColor, borderColor)}>
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
                <div>
                  <h3 className={cn("text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>
                    {t(lang, labelKey)}
                  </h3>
                  {mealEntries.length > 0 && (
                    <p className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                      {Math.round(mealTotals.calories)} kcal · P:{Math.round(mealTotals.protein)}g C:{Math.round(mealTotals.carbs)}g F:{Math.round(mealTotals.fat)}g
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveMeal(isAddingToThisMeal ? null : id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all duration-200",
                  isAddingToThisMeal
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isDark
                    ? "border-slate-700/60 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400"
                    : "border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
                )}
              >
                {isAddingToThisMeal ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {isAddingToThisMeal ? "Cancel" : t(lang, "addFood")}
              </button>
            </div>

            {/* Add Food Panel */}
            {isAddingToThisMeal && (
              <div className="px-4 pb-4">
                <AddFoodPanel
                  meal={id}
                  lang={lang}
                  isDark={isDark}
                  onAdd={(entry) => {
                    onAdd(entry);
                    setActiveMeal(null);
                  }}
                  onClose={() => setActiveMeal(null)}
                />
              </div>
            )}

            {/* Logged entries */}
            {mealEntries.length > 0 && (
              <div className={cn("border-t px-4 pb-4 pt-3 space-y-2", isDark ? "border-slate-800/60" : "border-slate-100")}>
                {mealEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors group",
                      isDark
                        ? "bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50"
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-semibold truncate", isDark ? "text-slate-200" : "text-slate-800")}>
                        {lang === "ar" ? entry.foodItem.nameAr : entry.foodItem.nameEn}
                        <span className={cn("ml-1.5 font-normal", isDark ? "text-slate-500" : "text-slate-400")}>
                          {entry.quantity}{entry.foodItem.type === "raw" ? "g" : " unit(s)"}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] font-bold text-emerald-400">{entry.totalCalories} kcal</span>
                        <span className={cn("text-[11px]", isDark ? "text-slate-500" : "text-slate-400")}>
                          P:{entry.totalProtein}g · C:{entry.totalCarbs}g · F:{entry.totalFat}g
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all",
                        isDark ? "hover:bg-rose-500/15 text-slate-500 hover:text-rose-400" : "hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {mealEntries.length === 0 && !isAddingToThisMeal && (
              <div className={cn("px-4 pb-4 text-center")}>
                <p className={cn("text-xs py-2", isDark ? "text-slate-600" : "text-slate-400")}>
                  {t(lang, "noItemsLogged")}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
