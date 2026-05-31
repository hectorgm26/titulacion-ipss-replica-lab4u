import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { TOOLS, ToolConfig } from "@/lib/toolConfig";
import { loadUserProfile } from "@/lib/userProfile";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ToolsIndexScreen() {
  const tools = Object.values(TOOLS);
  const [isPremium, setIsPremium] = useState(false);

  useFocusEffect(
    useCallback(() => {
      ToolsAnalytics.goToToolList();
      // Reload plan every time screen gains focus so lock updates after deal change
      loadUserProfile().then((profile) => {
        setIsPremium(profile?.plan === "premium");
      });
    }, []),
  );

  function isLocked(tool: ToolConfig): boolean {
    return tool.premium && !isPremium;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Herramientas</Text>
        <Text style={styles.subheader}>
          Selecciona un instrumento para comenzar
        </Text>

        {tools.map((tool) => {
          const locked = isLocked(tool);
          return (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.card,
                { borderLeftColor: tool.color },
                locked && styles.cardLocked,
              ]}
              activeOpacity={0.75}
              onPress={() => {
                ToolsAnalytics.openTool(tool.id);
                router.push(`/(tabs)/Tools/${tool.id}`);
              }}
            >
              <View
                style={[styles.iconBox, { backgroundColor: tool.colorLight }]}
              >
                <Text style={styles.emoji}>{tool.emoji}</Text>
                {/* Lock badge — shown when tool requires premium and user is free */}
                {locked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockEmoji}>🔒</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: locked ? "#aaa" : tool.color },
                    ]}
                  >
                    {tool.name}
                  </Text>
                  {locked && (
                    <View style={styles.premiumTag}>
                      <Text style={styles.premiumTagText}>Premium</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {tool.description}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f6f8" },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: "800", color: "#111", marginBottom: 4 },
  subheader: { fontSize: 14, color: "#777", marginBottom: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLocked: {
    opacity: 0.75,
    backgroundColor: "#fafafa",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    // relative positioning for lock badge
    position: "relative",
  },
  emoji: { fontSize: 26 },
  // Lock badge bottom-right corner of icon
  lockBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  lockEmoji: { fontSize: 11 },
  cardBody: { flex: 1 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  premiumTag: {
    backgroundColor: "#fff8e1",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#ffe082",
  },
  premiumTagText: { fontSize: 10, fontWeight: "700", color: "#f57f17" },
  cardDesc: { fontSize: 13, color: "#666", lineHeight: 18 },
  arrow: { fontSize: 24, color: "#bbb", marginLeft: 8 },
});
