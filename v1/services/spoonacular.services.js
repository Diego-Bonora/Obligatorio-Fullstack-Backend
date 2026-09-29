import "dotenv/config";
import axios from "axios";

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;
const MYMEMORY_BASE_URL = "https://api.mymemory.translated.net/get";

async function translateIngredient(spanishText) {
  try {
    const { data } = await axios.get(MYMEMORY_BASE_URL, {
      params: { q: spanishText, langpair: "es|en" },
      timeout: 5000,
    });
    return data?.responseData?.translatedText || spanishText;
  } catch (error) {
    console.warn(`[mymemory] No se pudo traducir "${spanishText}":`, error.message);
    return spanishText;
  }
}

export async function getNutrition(ingredients) {
  if (!API_KEY || !Array.isArray(ingredients) || ingredients.length === 0) {
    return null;
  }
  try {
    const englishIngredients = await Promise.all(ingredients.map(translateIngredient));

    const { data } = await axios.post(
      `${SPOONACULAR_BASE_URL}/recipes/parseIngredients`,
      new URLSearchParams({
        ingredientList: englishIngredients.join("\n"),
        servings: "1",
        includeNutrition: "true",
      }),
      {
        params: { apiKey: API_KEY },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 8000,
      }
    );

    const totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    for (const item of data) {
      const nutrients = item?.nutrition?.nutrients ?? [];
      totals.calories += findNutrient(nutrients, "Calories");
      totals.protein += findNutrient(nutrients, "Protein");
      totals.fat += findNutrient(nutrients, "Fat");
      totals.carbs += findNutrient(nutrients, "Carbohydrates");
    }

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      fat: Math.round(totals.fat),
      carbs: Math.round(totals.carbs),
      fetchedAt: new Date(),
    };
  } catch (error) {
    if (error?.response?.status === 402) {
      console.warn("[spoonacular] Límite diario de puntos alcanzado");
    } else {
      console.error("[spoonacular] Error consultando nutrición:", error.message);
    }
    return null;
  }
}

function findNutrient(nutrients, name) {
  return nutrients.find((n) => n.name === name)?.amount ?? 0;
}
