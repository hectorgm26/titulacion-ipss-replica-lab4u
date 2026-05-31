import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { getMeasurements, Measurement } from "@/lib/measurements";
import { getToolConfig } from "@/lib/toolConfig";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ExportFormat = "pdf" | "excel";

export default function SavedScreen() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const config = getToolConfig(tool);

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  const [exportTarget, setExportTarget] = useState<Measurement | null>(null);
  const [showExportPicker, setShowExportPicker] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const [exportDone, setExportDone] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getMeasurements(tool).then((data) => {
        setMeasurements(data);
        setLoading(false);
      });
    }, [tool]),
  );

  if (!config) return null;

  function openExportPicker(measurement: Measurement) {
    setExportTarget(measurement);
    setExportDone(false);
    setExportFormat(null);
    setShowExportPicker(true);
  }

  async function handleExport(format: ExportFormat) {
    ToolsAnalytics.exportMeasurement(tool, format === "pdf" ? "PDF" : "EXCEL");
    setExportFormat(format);
    setExporting(true);

    // Simulate export processing
    await new Promise((r) => setTimeout(r, 2000));

    setExporting(false);
    setExportDone(true);
  }

  function closeExportModal() {
    setShowExportPicker(false);
    setExportTarget(null);
    setExporting(false);
    setExportDone(false);
    setExportFormat(null);
  }

  function renderItem({ item }: { item: Measurement }) {
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={styles.measureCard}>
        <View style={styles.measureCardLeft}>
          <Text style={[styles.measureId, { color: config.color }]}>
            #{item.id.slice(-5)}
          </Text>
          <Text style={styles.measureDate}>
            {dateStr} — {timeStr}
          </Text>
          <Text style={styles.measureDuration}>
            ⏱ {item.durationSeconds}s · {Object.keys(item.data).length}{" "}
            variables
          </Text>
          <View style={styles.dataPreview}>
            {Object.entries(item.data)
              .slice(0, 2)
              .map(([k, v]) => (
                <Text key={k} style={styles.dataChip}>
                  {k}:{" "}
                  <Text style={{ color: config.color, fontWeight: "700" }}>
                    {v}
                  </Text>
                </Text>
              ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: config.colorLight }]}
          onPress={() => openExportPicker(item)}
        >
          <Text style={[styles.exportBtnText, { color: config.color }]}>
            Exportar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: config.colorLight }]}
    >
      {/* Export Modal */}
      <Modal visible={showExportPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {!exporting && !exportDone && (
              <>
                <Text style={styles.modalTitle}>Exportar medición</Text>
                <Text style={styles.modalSub}>
                  Selecciona el formato de exportación
                </Text>
                <TouchableOpacity
                  style={[styles.formatBtn, { borderColor: config.color }]}
                  onPress={() => handleExport("pdf")}
                >
                  <Text style={styles.formatEmoji}>📄</Text>
                  <Text style={[styles.formatText, { color: config.color }]}>
                    Exportar como PDF
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formatBtn, { borderColor: config.color }]}
                  onPress={() => handleExport("excel")}
                >
                  <Text style={styles.formatEmoji}>📊</Text>
                  <Text style={[styles.formatText, { color: config.color }]}>
                    Exportar como Excel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={closeExportModal}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}

            {exporting && !exportDone && (
              <>
                <ActivityIndicator size="large" color={config.color} />
                <Text style={[styles.exportingText, { color: config.color }]}>
                  Exportando como {exportFormat === "pdf" ? "PDF" : "Excel"}...
                </Text>
              </>
            )}

            {exportDone && (
              <>
                <Text style={styles.doneEmoji}>✅</Text>
                <Text style={styles.doneTitle}>¡Exportación exitosa!</Text>
                <Text style={styles.doneSub}>
                  La medición fue exportada correctamente como{" "}
                  {exportFormat === "pdf" ? "PDF" : "Excel"}.
                </Text>
                <TouchableOpacity
                  style={[styles.doneBtn, { backgroundColor: config.color }]}
                  onPress={closeExportModal}
                >
                  <Text style={styles.doneBtnText}>Listo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Content */}
      <View style={styles.container}>
        <Text style={[styles.header, { color: config.color }]}>
          Mediciones Guardadas
        </Text>
        <Text style={styles.subheader}>{config.name}</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={config.color} />
          </View>
        ) : measurements.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Sin mediciones</Text>
            <Text style={styles.emptyHint}>
              Aún no tienes mediciones guardadas para esta herramienta.
            </Text>
            <TouchableOpacity
              style={[styles.goMeasureBtn, { backgroundColor: config.color }]}
              onPress={() => router.replace(`/(tabs)/Tools/${tool}/measure`)}
            >
              <Text style={styles.goMeasureBtnText}>
                ▶ Iniciar primera medición
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={measurements}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { fontSize: 24, fontWeight: "800", marginBottom: 2 },
  subheader: { fontSize: 13, color: "#777", marginBottom: 16 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  emptyHint: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },
  goMeasureBtn: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  goMeasureBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  // Measurement card
  measureCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  measureCardLeft: { flex: 1, gap: 3 },
  measureId: { fontSize: 13, fontWeight: "700" },
  measureDate: { fontSize: 13, color: "#555" },
  measureDuration: { fontSize: 12, color: "#888" },
  dataPreview: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    flexWrap: "wrap",
  },
  dataChip: { fontSize: 12, color: "#666" },
  exportBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 12,
  },
  exportBtnText: { fontSize: 13, fontWeight: "700" },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    gap: 14,
    alignItems: "center",
    minHeight: 260,
    justifyContent: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  modalSub: { fontSize: 14, color: "#888", marginBottom: 4 },
  formatBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#fafafa",
  },
  formatEmoji: { fontSize: 24 },
  formatText: { fontSize: 16, fontWeight: "700" },
  cancelBtn: { paddingVertical: 12 },
  cancelText: { fontSize: 15, color: "#aaa" },
  exportingText: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  doneEmoji: { fontSize: 52 },
  doneTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  doneSub: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  doneBtn: {
    marginTop: 4,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
