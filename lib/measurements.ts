import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Measurement {
  id: string;
  toolId: string;
  durationSeconds: number;
  timestamp: number; // Date.now()
  data: Record<string, number>; // simulated sensor values
}

const KEY_PREFIX = "measurements_";

function storageKey(toolId: string): string {
  return `${KEY_PREFIX}${toolId}`;
}

export async function saveMeasurement(measurement: Measurement): Promise<void> {
  const existing = await getMeasurements(measurement.toolId);
  existing.unshift(measurement); // newest first
  await AsyncStorage.setItem(
    storageKey(measurement.toolId),
    JSON.stringify(existing),
  );
}

export async function getMeasurements(toolId: string): Promise<Measurement[]> {
  const raw = await AsyncStorage.getItem(storageKey(toolId));
  if (!raw) return [];
  return JSON.parse(raw) as Measurement[];
}

export async function clearMeasurements(toolId: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(toolId));
}

// Generates random simulated sensor values per tool
// Equivalent to the sensor data each iOS tool produces
export function generateSimulatedData(toolId: string): Record<string, number> {
  switch (toolId) {
    case "accelerometer":
      return {
        x: parseFloat((Math.random() * 4 - 2).toFixed(3)),
        y: parseFloat((Math.random() * 4 - 2).toFixed(3)),
        z: parseFloat((9.8 + Math.random() * 0.4 - 0.2).toFixed(3)),
      };

    case "sonometer":
      return {
        db: parseFloat((40 + Math.random() * 60).toFixed(1)), // 40–100 dB
        peak_db: parseFloat((60 + Math.random() * 40).toFixed(1)), // 60–100 dB
        frequency_hz: Math.floor(100 + Math.random() * 3900), // 100–4000 Hz
      };

    case "camera":
      return {
        fps: parseFloat((24 + Math.random() * 36).toFixed(1)), // 24–60 fps
        velocity_ms: parseFloat((Math.random() * 10).toFixed(3)), // 0–10 m/s
        distance_m: parseFloat((Math.random() * 5).toFixed(3)), // 0–5 m
      };

    case "plotter":
      return {
        amplitude: parseFloat((Math.random() * 10).toFixed(3)),
        frequency_hz: parseFloat((Math.random() * 100).toFixed(2)),
        phase_deg: parseFloat((Math.random() * 360).toFixed(1)),
      };

    case "rapidometer":
      return {
        reaction_time_ms: Math.floor(150 + Math.random() * 400), // 150–550 ms
        velocity_ms: parseFloat((Math.random() * 15).toFixed(3)),
        acceleration_ms2: parseFloat((Math.random() * 20).toFixed(3)),
      };

    case "colorimeter":
      return {
        absorbance: parseFloat((Math.random() * 2).toFixed(3)),
        transmittance: parseFloat((Math.random() * 100).toFixed(1)),
        wavelength_nm: Math.floor(400 + Math.random() * 300),
      };

    case "color-inspector":
      return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
        hue: parseFloat((Math.random() * 360).toFixed(1)),
        saturation: parseFloat((Math.random() * 100).toFixed(1)),
      };

    case "analyscope":
      return {
        zoom_factor: parseFloat((1 + Math.random() * 9).toFixed(1)), // 1x–10x
        brightness: Math.floor(Math.random() * 256),
        contrast: parseFloat((Math.random() * 100).toFixed(1)),
        sharpness: parseFloat((Math.random() * 100).toFixed(1)),
      };

    case "journal":
      return {
        entries: Math.floor(1 + Math.random() * 10),
        photos: Math.floor(Math.random() * 5),
        duration_min: parseFloat((1 + Math.random() * 60).toFixed(1)),
      };

    default:
      return {};
  }
}
