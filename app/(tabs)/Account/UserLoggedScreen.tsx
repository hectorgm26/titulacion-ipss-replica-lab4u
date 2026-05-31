import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import {
    clearUserProfile,
    loadUserProfile,
    UserProfile,
} from "@/lib/userProfile";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function UserLoggedScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile().then(setProfile);
    }, []),
  );

  const handleLogout = async () => {
    try {
      ToolsAnalytics.logout();
      await clearUserProfile();
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const typeLabel = profile?.userType === "student" ? "Estudiante" : "Profesor";
  const typeEmoji = profile?.userType === "student" ? "🎓" : "📚";
  const planLabel = profile?.plan === "premium" ? "Premium" : "Free";
  const isPremium = profile?.plan === "premium";

  // Avatar initials from email
  const email = user?.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarBox}>
          <View style={[styles.avatar, isPremium && styles.avatarPremium]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
            </View>
          )}
        </View>

        {/* Email */}
        <Text style={styles.email}>{email}</Text>

        {/* Info cards */}
        <View style={styles.cardsBox}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tipo de usuario</Text>
            <View style={styles.cardValueRow}>
              <Text style={styles.cardEmoji}>{typeEmoji}</Text>
              <Text style={styles.cardValue}>{typeLabel}</Text>
            </View>
          </View>

          <View style={[styles.card, isPremium && styles.cardHighlight]}>
            <Text style={styles.cardLabel}>Plan activo</Text>
            <View style={styles.cardValueRow}>
              <Text style={styles.cardEmoji}>{isPremium ? "⭐" : "🆓"}</Text>
              <Text
                style={[styles.cardValue, isPremium && styles.cardValuePremium]}
              >
                {planLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const GREEN = "#00a680";
const GREEN_DARK = "#007a60";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7f6" },
  scroll: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 16,
  },
  // Avatar
  avatarBox: { alignItems: "center", marginBottom: 4 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarPremium: {
    backgroundColor: GREEN_DARK,
    shadowColor: GREEN_DARK,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  premiumBadge: {
    marginTop: 10,
    backgroundColor: GREEN_DARK,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  premiumBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  // Email
  email: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
    marginBottom: 8,
  },
  // Cards
  cardsBox: {
    width: "100%",
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHighlight: {
    borderColor: GREEN,
    shadowColor: GREEN,
    shadowOpacity: 0.15,
  },
  cardLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardEmoji: { fontSize: 24 },
  cardValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  cardValuePremium: {
    color: GREEN_DARK,
  },
  // Logout
  logoutBtn: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ff4444",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ff4444",
  },
});
