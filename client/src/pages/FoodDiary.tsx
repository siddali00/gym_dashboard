import { useState, useMemo, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Btn } from "../components/ui";
import { MEAL_NAMES } from "../data/constants";
import { FOOD_DB, type FoodItem } from "../data/foods";
import { api } from "../api";
import { useI18n, type TKey } from "../i18n";

interface MealFood {
  id: number;
  name: string;
  grams: number;
  kcal: number;
  pro: number;
  cho: number;
  fat: number;
  fib: number;
}

interface Meal {
  id: number;
  name: string;
  time: string;
  foods: MealFood[];
}

const MEAL_LABEL_KEYS = ["meal_breakfast", "meal_snack_am", "meal_lunch", "meal_snack_pm", "meal_dinner"] as const;

const r2 = (n: number) => Math.round(n * 10) / 10;
const mealTotals = (foods: MealFood[]) =>
  foods.reduce((a, f) => ({ kcal: a.kcal + f.kcal, pro: a.pro + f.pro, cho: a.cho + f.cho, fat: a.fat + f.fat, fib: a.fib + f.fib }), { kcal: 0, pro: 0, cho: 0, fat: 0, fib: 0 });

const emptyMeals = (): Meal[] => MEAL_NAMES.map((m, i) => ({ id: i + 1, ...m, foods: [] }));

export function FoodDiary() {
  const { t } = useI18n();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [meals, setMeals] = useState<Meal[]>(emptyMeals);
  const [search, setSearch] = useState("");
  const [selMeal, setSelMeal] = useState(1);
  const [selFood, setSelFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");
  const [isSaved, setIsSaved] = useState(false);
  const [customDB, setCustomDB] = useState<FoodItem[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [cf, setCf] = useState({ name: "", kcal: "", pro: "", cho: "", fat: "", fib: "" });
  const searchRef = useRef<HTMLInputElement>(null);

  function mealTitle(meal: Meal) {
    if (meal.id >= 1 && meal.id <= 5) return t(MEAL_LABEL_KEYS[meal.id - 1] as TKey);
    return meal.name;
  }

  function selectMealForAdd(mealId: number) {
    setSelMeal(mealId);
    setShowCustom(false);
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  useEffect(() => {
    api.getCustomFoods().then((foods) => {
      setCustomDB(foods.map((f: any) => ({ ...f, id: f.id + 10000, cat: f.cat === "Personalizzato" || !f.cat ? undefined : f.cat })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.getFoodDay(date).then((day) => {
      if (day && day.meals) setMeals(day.meals);
      else setMeals(emptyMeals());
      setIsSaved(false);
    }).catch(() => setMeals(emptyMeals()));
  }, [date]);

  const allFoods = useMemo(() => {
    return [
      ...FOOD_DB,
      ...customDB.map((f) => ({
        ...f,
        cat: f.cat === "Personalizzato" || (f as any).cat === undefined ? t("cat_custom") : f.cat,
      })),
    ];
  }, [customDB, t]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allFoods;
    return allFoods.filter((f) => f.name.toLowerCase().includes(q));
  }, [search, allFoods]);

  const dayTot = useMemo(
    () => meals.reduce((a, m) => { const tt = mealTotals(m.foods); return { kcal: a.kcal + tt.kcal, pro: a.pro + tt.pro, cho: a.cho + tt.cho, fat: a.fat + tt.fat, fib: a.fib + tt.fib }; }, { kcal: 0, pro: 0, cho: 0, fat: 0, fib: 0 }),
    [meals]
  );

  function addFood() {
    if (!selFood) return;
    const g = parseFloat(grams) || 100;
    const k = g / 100;
    const item: MealFood = {
      id: Date.now(),
      name: selFood.name,
      grams: g,
      kcal: Math.round(selFood.kcal * k),
      pro: r2(selFood.pro * k),
      cho: r2(selFood.cho * k),
      fat: r2(selFood.fat * k),
      fib: r2(selFood.fib * k),
    };
    setMeals((prev) => prev.map((m) => (m.id === selMeal ? { ...m, foods: [...m.foods, item] } : m)));
    setSelFood(null);
    setGrams("100");
    setSearch("");
    setIsSaved(false);
  }

  async function saveDay() {
    await api.saveFoodDay(date, meals);
    setIsSaved(true);
  }

  async function addCustom() {
    if (!cf.name || !cf.kcal) return;
    const food = await api.addCustomFood({
      name: cf.name,
      kcal: parseFloat(cf.kcal),
      pro: parseFloat(cf.pro) || 0,
      cho: parseFloat(cf.cho) || 0,
      fat: parseFloat(cf.fat) || 0,
      fib: parseFloat(cf.fib) || 0,
    });
    setCustomDB((d) => [...d, { ...food, id: food.id + 10000, cat: "Personalizzato" }]);
    setCf({ name: "", kcal: "", pro: "", cho: "", fat: "", fib: "" });
    setShowCustom(false);
  }

  const totK = Math.round(dayTot.kcal);
  const pP = totK > 0 ? Math.round((dayTot.pro * 4 / totK) * 100) : 0;
  const pC = totK > 0 ? Math.round((dayTot.cho * 4 / totK) * 100) : 0;
  const pF = totK > 0 ? Math.round((dayTot.fat * 9 / totK) * 100) : 0;

  const macros: [TKey, string | number, string, string][] = [
    ["fd_macro_cal", totK, "kcal", "text-accent"],
    ["fd_macro_pro", pP + "%", "", "text-green"],
    ["fd_macro_carbo", pC + "%", "", "text-amber"],
    ["fd_macro_fat", pF + "%", "", "text-blue"],
    ["fd_macro_fib", r2(dayTot.fib) + "g", "", "text-purple"],
  ];

  return (
    <>
      <PageHead title={t("fd_title")} accent={t("fd_accent")} sub={t("fd_sub")} />

      <div className="flex gap-2.5 items-center mb-4 flex-wrap">
        <Inp type="date" value={date} onChange={(e) => setDate(e.target.value)} className="max-w-[180px]" />
        <div className="flex gap-2 flex-wrap">
          {macros.map(([lbl, val, u, color]) => (
            <div key={lbl} className="bg-card border border-border rounded-[9px] px-3.5 py-1.5 text-center">
              <div className={`font-bebas text-xl ${color}`}>
                {val}{u && <span className="text-[11px]"> {u}</span>}
              </div>
              <div className="text-[9px] text-muted uppercase">{t(lbl)}</div>
            </div>
          ))}
        </div>
        <Btn variant={isSaved ? "green" : "primary"} onClick={saveDay} className="ml-auto">
          {t("fd_save_day")}
        </Btn>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4">
        <div className="flex flex-col gap-3">
          {meals.map((meal) => {
            const mt = mealTotals(meal.foods);
            return (
              <Card key={meal.id} className={selMeal === meal.id ? "!border-accent/40" : ""}>
                <CardHead>
                  <span onClick={() => selectMealForAdd(meal.id)} className="font-bebas text-sm cursor-pointer">
                    {mealTitle(meal)} <span className="text-[11px] text-muted">· {meal.time}</span>
                  </span>
                  <div className="flex gap-2 items-center">
                    {meal.foods.length > 0 && <span className="text-[11px] text-muted">{Math.round(mt.kcal)} kcal</span>}
                    <Btn variant="blue" onClick={() => selectMealForAdd(meal.id)} className="!text-[11px] !px-2.5 !py-1">{t("fd_add")}</Btn>
                  </div>
                </CardHead>
                <div className="px-4">
                  {meal.foods.length === 0 ? (
                    <p className="text-muted text-xs py-2.5">{t("fd_no_foods")}</p>
                  ) : (
                    meal.foods.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 py-2 border-b border-border">
                        <div className="flex-1">
                          <div className="text-[13px]">{f.name}</div>
                          <div className="text-[11px] text-muted">{f.grams}g · P{f.pro}g C{f.cho}g G{f.fat}g</div>
                        </div>
                        <div className="font-bebas text-base text-accent">{f.kcal}</div>
                        <span className="text-[10px] text-muted">kcal</span>
                        <button
                          onClick={() => setMeals((prev) => prev.map((m) => (m.id === meal.id ? { ...m, foods: m.foods.filter((x) => x.id !== f.id) } : m)))}
                          className="bg-none border-none text-muted cursor-pointer text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          <Card>
            <CardHead>
              <span className="font-bebas text-[13px]">{t("fd_search_title")}</span>
              <button onClick={() => setShowCustom(!showCustom)} className="bg-none border border-border text-muted rounded-md px-2 py-0.5 cursor-pointer text-[10px]">
                {t("fd_custom_toggle")}
              </button>
            </CardHead>
            <div className="p-3.5">
              <div className="bg-el border border-border rounded-lg p-2.5 mb-2 text-xs">
                <span className="text-muted">{t("fd_target_meal")} </span>
                <strong>{mealTitle(meals.find((m) => m.id === selMeal) || meals[0])}</strong>
              </div>
              <Inp
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("fd_search_ph")}
                className="mb-2"
              />
              <div className="text-[10px] text-muted mb-2">{t("fd_pick_food_hint")}</div>
              <div className="text-[10px] text-muted mb-2">
                {t("fd_showing_foods", { shown: String(filtered.length), total: String(allFoods.length) })}
              </div>
              <div className="text-[10px] text-muted mb-2">{t("fd_source")}</div>
              <div className="max-h-[360px] overflow-y-auto flex flex-col gap-1 pr-1">
                {filtered.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => { setSelFood(f); setSearch(f.name); }}
                    className={`p-2 px-2.5 rounded-[7px] cursor-pointer text-xs border ${
                      selFood?.id === f.id ? "bg-accent/10 border-accent/30" : "bg-el border-border hover:bg-white/[.03]"
                    }`}
                  >
                    <div className="font-medium">{f.name}</div>
                    <div className="text-muted text-[10px]">{f.cat} · {f.kcal}kcal/100g · P{f.pro}g C{f.cho}g G{f.fat}g</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {selFood && (
            <Card className="p-3.5">
              <div className="text-[13px] font-medium mb-2.5">{selFood.name}</div>
              <FG label={t("fd_qty_g")}>
                <Inp type="number" value={grams} onChange={(e) => setGrams(e.target.value)} min={1} />
              </FG>
              <div className="bg-el rounded-lg p-2 px-3 mb-2.5 text-xs grid grid-cols-2 gap-1">
                <span className="text-accent font-semibold">Kcal: {Math.round(selFood.kcal * (parseFloat(grams) || 0) / 100)}</span>
                <span>P: {r2(selFood.pro * (parseFloat(grams) || 0) / 100)}g</span>
                <span>C: {r2(selFood.cho * (parseFloat(grams) || 0) / 100)}g</span>
                <span>G: {r2(selFood.fat * (parseFloat(grams) || 0) / 100)}g</span>
              </div>
              <div className="text-[11px] text-muted mb-2">{t("fd_to_meal")} <strong>{mealTitle(meals.find((m) => m.id === selMeal)!)}</strong></div>
              <Btn onClick={addFood} className="w-full">{t("fd_add_to_meal")}</Btn>
            </Card>
          )}

          {showCustom && (
            <Card className="p-3.5">
              <div className="font-bebas text-[13px] mb-3">{t("fd_custom_title")}</div>
              <FG label={t("fd_cf_name")}>
                <Inp value={cf.name} onChange={(e) => setCf((f) => ({ ...f, name: e.target.value }))} placeholder="es. Proteina vegana X" />
              </FG>
              <div className="grid grid-cols-2 gap-2">
                <FG label={t("fd_cf_kcal")}>
                  <Inp type="number" value={cf.kcal} onChange={(e) => setCf((f) => ({ ...f, kcal: e.target.value }))} />
                </FG>
                <FG label={t("fd_cf_pro")}>
                  <Inp type="number" value={cf.pro} onChange={(e) => setCf((f) => ({ ...f, pro: e.target.value }))} />
                </FG>
                <FG label={t("fd_cf_cho")}>
                  <Inp type="number" value={cf.cho} onChange={(e) => setCf((f) => ({ ...f, cho: e.target.value }))} />
                </FG>
                <FG label={t("fd_cf_fat")}>
                  <Inp type="number" value={cf.fat} onChange={(e) => setCf((f) => ({ ...f, fat: e.target.value }))} />
                </FG>
              </div>
              <Btn variant="green" onClick={addCustom} className="w-full">{t("fd_add_db")}</Btn>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
