export type ToolId =
  | "accelerometer"
  | "colorimeter"
  | "color-inspector"
  | "sonometer"
  | "camera"
  | "plotter"
  | "analyscope"
  | "journal"
  | "rapidometer";

export interface ToolConfig {
  id: ToolId;
  uuid: string; // real Lab4U tool_id sent to Mixpanel
  name: string;
  description: string;
  emoji: string;
  color: string;
  colorLight: string;
  simulationLabel: string;
  premium: boolean; // true = requires premium plan
}

export const TOOLS: Record<ToolId, ToolConfig> = {
  // ── Physics ──────────────────────────────────────────────────────────────
  accelerometer: {
    id: "accelerometer",
    uuid: "68877C92-B33E-470E-93B3-835F8239D8E3",
    name: "Acelerómetro",
    description:
      "Mide la aceleración del dispositivo en los ejes X, Y y Z usando el sensor inercial del smartphone.",
    emoji: "📐",
    color: "#1a73e8",
    colorLight: "#e8f0fe",
    simulationLabel: "Midiendo aceleración (m/s²)...",
    premium: false,
  },
  sonometer: {
    id: "sonometer",
    uuid: "C9CA5BF6-698C-4BAF-BCFC-3BD5AE5158AF",
    name: "Sonómetro",
    description:
      "Mide el nivel de presión sonora en decibeles usando el micrófono del smartphone.",
    emoji: "🎙️",
    color: "#f57c00",
    colorLight: "#fff3e0",
    simulationLabel: "Midiendo nivel de sonido (dB)...",
    premium: false,
  },
  camera: {
    id: "camera",
    uuid: "B0A96BC7-04DF-43B4-8795-803B7F8A0E22",
    name: "Cámara",
    description:
      "Captura y analiza fenómenos físicos mediante la cámara del smartphone con análisis de movimiento.",
    emoji: "📷",
    color: "#6d4c41",
    colorLight: "#efebe9",
    simulationLabel: "Capturando frames de video...",
    premium: true,
  },
  plotter: {
    id: "plotter",
    uuid: "56f822cb-334a-42de-8f97-a4fcbbba8c8c",
    name: "Graficador",
    description:
      "Grafica en tiempo real datos de sensores y permite análisis de funciones matemáticas.",
    emoji: "📈",
    color: "#7b1fa2",
    colorLight: "#f3e5f5",
    simulationLabel: "Graficando datos del sensor...",
    premium: false,
  },
  rapidometer: {
    id: "rapidometer",
    uuid: "CA2117F3-75B2-44BB-A62F-8770A2F34792",
    name: "Rapidómetro",
    description:
      "Mide tiempos de reacción y velocidades usando la cámara y el acelerómetro del dispositivo.",
    emoji: "⚡",
    color: "#c62828",
    colorLight: "#ffebee",
    simulationLabel: "Midiendo velocidad de reacción...",
    premium: true,
  },
  // ── Chemistry ─────────────────────────────────────────────────────────────
  colorimeter: {
    id: "colorimeter",
    uuid: "730d9ce6-8d18-4d60-ae5e-1e215ea8a77c",
    name: "Colorímetro",
    description:
      "Analiza la absorbancia y transmitancia de una muestra usando la cámara como sensor óptico.",
    emoji: "🔬",
    color: "#e53935",
    colorLight: "#fce8e6",
    simulationLabel: "Analizando muestra óptica...",
    premium: false,
  },
  "color-inspector": {
    id: "color-inspector",
    uuid: "1ca1fed2-8572-4ac2-b337-47a16304f2f4",
    name: "Inspector de Color",
    description:
      "Detecta y clasifica colores en tiempo real capturando el espectro RGB visible del entorno.",
    emoji: "🎨",
    color: "#43a047",
    colorLight: "#e6f4ea",
    simulationLabel: "Capturando espectro de color...",
    premium: false,
  },
  // ── Biology ───────────────────────────────────────────────────────────────
  analyscope: {
    id: "analyscope",
    uuid: "16106ff1-d0be-4fd8-894a-cd6e1f2d472a",
    name: "Analiscopio",
    description:
      "Convierte el smartphone en un microscopio digital para observar y analizar muestras biológicas.",
    emoji: "🔭",
    color: "#00838f",
    colorLight: "#e0f7fa",
    simulationLabel: "Analizando muestra microscópica...",
    premium: false,
  },
  journal: {
    id: "journal",
    uuid: "9b9f521d-05c8-4806-8ce5-a7b2bcdffb53",
    name: "Bitácora",
    description:
      "Registra y organiza observaciones, datos y resultados de experimentos en un cuaderno digital.",
    emoji: "📓",
    color: "#2e7d32",
    colorLight: "#e8f5e9",
    simulationLabel: "Registrando observación...",
    premium: true,
  },
};

export function getToolConfig(id: string): ToolConfig | null {
  return TOOLS[id as ToolId] ?? null;
}

// Returns the real Lab4U UUID for a given tool string id
// Equivalent to toolDictionary lookup in iOS
export function getToolUuid(id: string): string {
  return TOOLS[id as ToolId]?.uuid ?? id;
}
