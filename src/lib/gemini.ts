import { GoogleGenAI } from "@google/genai";
import type { VehicleFormData } from "../types/vehicle";

const MODEL = "gemini-3-flash-preview";

function getClient(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
}

function buildDescriptionPrompt(
  vehicle: Pick<
    VehicleFormData,
    | "brand"
    | "model"
    | "version"
    | "year"
    | "km"
    | "condition"
    | "fuel_type"
    | "transmission"
    | "horsepower"
    | "engine_cc"
    | "color_ext"
    | "features"
  >,
  currentDescription: string
): string {
  const specs = [
    `Marca: ${vehicle.brand}`,
    `Modelo: ${vehicle.model}`,
    vehicle.version ? `Versión: ${vehicle.version}` : null,
    `Año: ${vehicle.year}`,
    `Condición: ${vehicle.condition === "0km" ? "0 kilómetros (nuevo)" : `${vehicle.km.toLocaleString("es-AR")} km recorridos`}`,
    vehicle.engine_cc > 0
      ? `Motor: ${vehicle.engine_cc}cc, ${vehicle.horsepower} CV`
      : `Motor: Eléctrico, ${vehicle.horsepower} CV`,
    `Transmisión: ${vehicle.transmission}`,
    `Combustible: ${vehicle.fuel_type}`,
    `Color exterior: ${vehicle.color_ext}`,
    vehicle.features.length > 0
      ? `Equipamiento destacado: ${vehicle.features.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `Eres el redactor de contenido de Guernica Motors, una concesionaria argentina de vehículos premium. Tu tarea es escribir una descripción de venta atractiva, exclusiva y persuasiva para el siguiente vehículo.

ESPECIFICACIONES DEL VEHÍCULO:
${specs}

DESCRIPCIÓN ACTUAL (puede estar vacía o incompleta):
${currentDescription.trim() || "(sin descripción)"}

INSTRUCCIONES:
- Escribe en español argentino, con tono premium y exclusivo
- La descripción debe tener entre 2 y 4 oraciones cortas y directas
- Destaca los atributos más emocionales y diferenciadores del vehículo
- Si el vehículo tiene 0km, enfatiza la novedad y garantía
- Si es usado, destaca el valor, estado y oportunidad
- Incluye 1-2 menciones de equipamiento específico del listado de features si hay alguno
- NO uses signos de exclamación excesivos ni lenguaje genérico
- NO menciones precios ni condiciones comerciales
- Devuelve ÚNICAMENTE el texto de la descripción, sin títulos, sin comillas, sin formato markdown

Descripción:`;
}

export async function generateVehicleDescription(
  vehicle: Pick<
    VehicleFormData,
    | "brand"
    | "model"
    | "version"
    | "year"
    | "km"
    | "condition"
    | "fuel_type"
    | "transmission"
    | "horsepower"
    | "engine_cc"
    | "color_ext"
    | "features"
  >,
  currentDescription: string
): Promise<string> {
  const ai = getClient();
  const prompt = buildDescriptionPrompt(vehicle, currentDescription);
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text?.trim() ?? currentDescription;
}
