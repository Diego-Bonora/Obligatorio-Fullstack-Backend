import "dotenv/config";
import axios from "axios";

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";
const API_KEY = process.env.SPOONACULAR_API_KEY;
const MYMEMORY_BASE_URL = "https://api.mymemory.translated.net/get";

async function traducirIngrediente(textoEs) {
  try {
    const { data } = await axios.get(MYMEMORY_BASE_URL, {
      params: { q: textoEs, langpair: "es|en" },
      timeout: 5000,
    });
    return data?.responseData?.translatedText || textoEs;
  } catch (error) {
    console.warn(`[mymemory] No se pudo traducir "${textoEs}":`, error.message);
    return textoEs;
  }
}

export async function obtenerNutricion(ingredientes) {
  if (!API_KEY || !Array.isArray(ingredientes) || ingredientes.length === 0) {
    return null;
  }
  try {
    const ingredientesEn = await Promise.all(ingredientes.map(traducirIngrediente));

    const { data } = await axios.post(
      `${SPOONACULAR_BASE_URL}/recipes/parseIngredients`,
      new URLSearchParams({
        ingredientList: ingredientesEn.join("\n"),
        servings: "1",
        includeNutrition: "true",
      }),
      {
        params: { apiKey: API_KEY },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 8000,
      }
    );

    const totales = { calorias: 0, proteinas: 0, grasas: 0, carbohidratos: 0 };

    for (const item of data) {
      const nutrientes = item?.nutrition?.nutrients ?? [];
      totales.calorias += buscarNutriente(nutrientes, "Calories");
      totales.proteinas += buscarNutriente(nutrientes, "Protein");
      totales.grasas += buscarNutriente(nutrientes, "Fat");
      totales.carbohidratos += buscarNutriente(nutrientes, "Carbohydrates");
    }

    return {
      calorias: Math.round(totales.calorias),
      proteinas: Math.round(totales.proteinas),
      grasas: Math.round(totales.grasas),
      carbohidratos: Math.round(totales.carbohidratos),
      consultadoEn: new Date(),
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

function buscarNutriente(nutrientes, nombre) {
  return nutrientes.find((n) => n.name === nombre)?.amount ?? 0;
}