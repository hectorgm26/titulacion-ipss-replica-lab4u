import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { generateSimulatedData } from "@/lib/measurements";
import { getToolConfig } from "@/lib/toolConfig";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type MeasureState = "idle" | "measuring" | "stopping" | "success";

export default function MeasureScreen() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const config = getToolConfig(tool);

  const [state, setState] = useState<MeasureState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startMeasuring() {
    ToolsAnalytics.startMeasurementSuccess(tool);
    setState("measuring");
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }

  async function stopMeasuring() {
    ToolsAnalytics.endMeasurement(tool);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("stopping");

    // Simula procesamiento de datos ~1.2s
    await new Promise((r) => setTimeout(r, 1200));

    setState("success");
    setShowSuccessModal(true);
  }

  function handleSuccessConfirm() {
    setShowSuccessModal(false);
    const simulatedData = generateSimulatedData(tool);
    router.push({
      pathname: `/(tabs)/Tools/${tool}/result`,
      params: {
        duration: String(elapsed),
        data: JSON.stringify(simulatedData),
      },
    });
  }

  if (!config) return null;

  const isRunning = state === "measuring";
  const isProcessing = state === "stopping";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: config.colorLight }]}
    >
      {/* Success modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>✅</Text>
            <Text style={styles.modalTitle}>¡Medición exitosa!</Text>
            <Text style={styles.modalBody}>
              La medición se completó correctamente. Puedes ver y guardar los
              resultados.
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: config.color }]}
              onPress={handleSuccessConfirm}
            >
              <Text style={styles.modalBtnText}>Ver resultados →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Status area */}
        <View style={styles.statusBox}>
          {isProcessing ? (
            <>
              <Text style={styles.processingEmoji}>⚙️</Text>
              <Text style={[styles.statusLabel, { color: config.color }]}>
                Procesando datos...
              </Text>
            </>
          ) : isRunning ? (
            <>
              <View style={[styles.pulseRing, { borderColor: config.color }]}>
                <View
                  style={[styles.pulseDot, { backgroundColor: config.color }]}
                />
              </View>
              <Text style={[styles.statusLabel, { color: config.color }]}>
                {config.simulationLabel}
              </Text>
              <Text style={styles.timer}>{formatTime(elapsed)}</Text>
            </>
          ) : (
            <>
              <Text style={styles.idleEmoji}>{config.emoji}</Text>
              <Text style={styles.idleLabel}>Listo para medir</Text>
              <Text style={styles.idleHint}>
                Presiona el botón para iniciar la medición
              </Text>
            </>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.buttonsBox}>
          {!isRunning && !isProcessing && (
            <TouchableOpacity
              style={[styles.btnStart, { backgroundColor: config.color }]}
              onPress={startMeasuring}
            >
              <Text style={styles.btnStartText}>▶ Iniciar Medición</Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <TouchableOpacity style={styles.btnStop} onPress={stopMeasuring}>
              <Text style={styles.btnStopText}>⏹ Parar Medición</Text>
            </TouchableOpacity>
          )}

          {isProcessing && (
            <View style={[styles.btnDisabled]}>
              <Text style={styles.btnDisabledText}>Procesando...</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 28,
  },
  statusBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  idleEmoji: { fontSize: 72 },
  idleLabel: { fontSize: 22, fontWeight: "700", color: "#222" },
  idleHint: { fontSize: 14, color: "#888", textAlign: "center" },
  pulseRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.8,
  },
  statusLabel: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  timer: { fontSize: 52, fontWeight: "800", color: "#111", letterSpacing: 2 },
  processingEmoji: { fontSize: 52 },
  buttonsBox: { gap: 12 },
  btnStart: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  btnStartText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  btnStop: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#d32f2f",
    shadowColor: "#d32f2f",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnStopText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  btnDisabled: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  btnDisabledText: { color: "#888", fontSize: 17, fontWeight: "600" },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    gap: 10,
    width: "100%",
    maxWidth: 340,
  },
  modalEmoji: { fontSize: 48 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  modalBody: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  modalBtn: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  modalBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
