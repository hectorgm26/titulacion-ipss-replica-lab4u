import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { saveMeasurement } from "@/lib/measurements";
import { getToolConfig } from "@/lib/toolConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ResultScreen() {
  const { tool, duration, data } = useLocalSearchParams<{
    tool: string;
    duration: string;
    data: string;
  }>();
  const config = getToolConfig(tool);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!config) return null;

  const durationSec = parseInt(duration ?? "0", 10);
  const sensorData: Record<string, number> = data ? JSON.parse(data) : {};

  async function handleSave() {
    if (saved) return;
    setSaving(true);
    const measurement = {
      id: Date.now().toString(),
      toolId: tool,
      durationSeconds: durationSec,
      timestamp: Date.now(),
      data: sensorData,
    };
    await saveMeasurement(measurement);
    setSaving(false);
    setSaved(true);
    Alert.alert("✅ Guardado", "La medición fue guardada exitosamente.", [
      { text: "OK" },
    ]);
  }

  function handleRetry() {
    router.replace(`/(tabs)/Tools/${tool}/measure`);
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: config.colorLight }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.emoji}>{config.emoji}</Text>
          <Text style={[styles.title, { color: config.color }]}>
            Resultados
          </Text>
          <Text style={styles.toolName}>{config.name}</Text>
        </View>

        {/* Duration card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>⏱ Duración de la medición</Text>
          <Text style={[styles.cardValue, { color: config.color }]}>
            {formatTime(durationSec)}
          </Text>
          <Text style={styles.cardSub}>{durationSec} segundos</Text>
        </View>

        {/* Sensor data card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>📊 Datos del sensor</Text>
          {Object.entries(sensorData).map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataKey}>{formatKey(key)}</Text>
              <Text style={[styles.dataValue, { color: config.color }]}>
                {formatValue(key, value)}
              </Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsBox}>
          <TouchableOpacity
            style={[
              styles.btnSave,
              { backgroundColor: saved ? "#aaa" : config.color },
            ]}
            onPress={handleSave}
            disabled={saved || saving}
          >
            <Text style={styles.btnSaveText}>
              {saving
                ? "Guardando..."
                : saved
                  ? "✓ Guardado"
                  : "💾  Guardar medición"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnRetry}
            onPress={() => {
              ToolsAnalytics.retryMeasurement(tool);
              handleRetry();
            }}
          >
            <Text style={[styles.btnRetryText, { color: config.color }]}>
              🔄 Volver a intentar medición
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnBackToTools}
            onPress={() => router.push("/(tabs)/Tools")}
          >
            <Text style={styles.btnBackToToolsText}>
              🧰 Volver a herramientas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(key: string, value: number): string {
  if (key === "wavelength_nm") return `${value} nm`;
  if (key === "transmittance") return `${value}%`;
  if (key === "hue") return `${value}°`;
  if (key === "saturation") return `${value}%`;
  if (key.startsWith("r") || key.startsWith("g") || key.startsWith("b"))
    return String(value);
  return `${value}`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40, gap: 16 },
  headerBox: {
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  emoji: { fontSize: 52 },
  title: { fontSize: 26, fontWeight: "800" },
  toolName: { fontSize: 14, color: "#777" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    marginBottom: 4,
  },
  cardValue: { fontSize: 48, fontWeight: "800", textAlign: "center" },
  cardSub: { fontSize: 13, color: "#aaa", textAlign: "center" },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dataKey: { fontSize: 14, color: "#555" },
  dataValue: { fontSize: 15, fontWeight: "700" },
  buttonsBox: { gap: 12, marginTop: 8 },
  btnSave: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  btnSaveText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  btnRetry: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  btnRetryText: { fontSize: 16, fontWeight: "600" },
  btnBackToTools: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  btnBackToToolsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },
});
