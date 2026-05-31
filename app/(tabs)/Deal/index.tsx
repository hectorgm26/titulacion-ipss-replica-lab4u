import LoadingModal from "@/components/LoadingModal/LoadingModal";
import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { FCMTopicManager } from "@/lib/fcmTopicManager";
import {
    clearUserProfile,
    loadUserProfile,
    saveUserProfile,
    UserPlan,
    UserProfile,
    UserType,
} from "@/lib/userProfile";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Step = "loading" | "noAuth" | "userType" | "plan" | "done";

export default function DealScreen() {
  useFocusEffect(
    useCallback(() => {
      ToolsAnalytics.goToDealView();
    }, []),
  );

  const { newUser } = useLocalSearchParams<{ newUser?: string }>();

  const [step, setStep] = useState<Step>("loading");
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [simulatingPurchase, setSimulatingPurchase] = useState(false);
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStep("noAuth");
        return;
      }
      if (newUser === "true") {
        setStep("userType");
        return;
      }
      const profile = await loadUserProfile();
      if (profile) {
        setSavedProfile(profile);
        setStep("done");
      } else {
        setStep("userType");
      }
    });
    return unsubscribe;
  }, [newUser]);

  async function handleSelectType(type: UserType) {
    setSelectedType(type);
    setStep("plan");
  }

  async function handleSelectPlan(plan: UserPlan) {
    if (!selectedType) return;

    if (plan === "premium") {
      ToolsAnalytics.buyPremium(selectedType);
      setSimulatingPurchase(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setSimulatingPurchase(false);
    }

    const profile: UserProfile = { userType: selectedType, plan };
    await saveUserProfile(profile);
    setSavedProfile(profile);

    // Update FCM topic subscription immediately after profile change
    // This unsubscribes from old topic and subscribes to new one automatically
    // Equivalent to updateSubscriptionsForCurrentUser() call after user data change in iOS
    await FCMTopicManager.updateSubscriptionsForCurrentUser();

    setStep("done");
  }

  async function handleReset() {
    await clearUserProfile();
    setSavedProfile(null);
    setSelectedType(null);
    const auth = getAuth();
    setStep(auth.currentUser ? "userType" : "noAuth");
  }

  // ── loading inicial ─────────────────────────────────────────────────────────
  if (step === "loading") {
    return <LoadingModal show text="Cargando..." />;
  }

  // ── sin sesión ──────────────────────────────────────────────────────────────
  if (step === "noAuth") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.noAuthEmoji}>🔒</Text>
          <Text style={styles.noAuthTitle}>Inicia sesión primero</Text>
          <Text style={styles.noAuthBody}>
            Para configurar tu plan de usuario debes tener una cuenta activa.
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push("/(tabs)/Account")}
          >
            <Text style={styles.btnPrimaryText}>Ir a Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── perfil ya guardado ──────────────────────────────────────────────────────
  if (step === "done" && savedProfile) {
    const typeLabel =
      savedProfile.userType === "student" ? "Estudiante" : "Profesor";
    const planLabel = savedProfile.plan === "premium" ? "Premium ⭐" : "Free";
    const isPremium = savedProfile.plan === "premium";

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[styles.card, isPremium && styles.cardPremium]}>
            <Text style={styles.cardEmoji}>{isPremium ? "⭐" : "👤"}</Text>
            <Text style={styles.cardTitle}>Perfil activo</Text>
            <Text style={styles.cardDetail}>
              Tipo: <Text style={styles.bold}>{typeLabel}</Text>
            </Text>
            <Text style={styles.cardDetail}>
              Plan:{" "}
              <Text style={[styles.bold, isPremium && styles.premiumText]}>
                {planLabel}
              </Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.btnSecondary} onPress={handleReset}>
            <Text style={styles.btnSecondaryText}>Cambiar perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── selección de tipo de usuario ────────────────────────────────────────────
  if (step === "userType") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingModal
          show={simulatingPurchase}
          text="Simulando compra de Premium"
        />
        <View style={styles.container}>
          <Text style={styles.title}>¿Usted es...?</Text>
          <Text style={styles.subtitle}>
            Seleccione su perfil para personalizar la experiencia
          </Text>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => handleSelectType("student")}
          >
            <Text style={styles.btnPrimaryEmoji}>🎓</Text>
            <Text style={styles.btnPrimaryText}>Estudiante</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => handleSelectType("teacher")}
          >
            <Text style={styles.btnPrimaryEmoji}>📚</Text>
            <Text style={styles.btnPrimaryText}>Profesor</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── selección de plan ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingModal
        show={simulatingPurchase}
        text="Simulando compra de Premium"
      />
      <View style={styles.container}>
        <Text style={styles.title}>Elige tu plan</Text>
        <Text style={styles.subtitle}>
          Perfil seleccionado:{" "}
          <Text style={styles.bold}>
            {selectedType === "student" ? "Estudiante 🎓" : "Profesor 📚"}
          </Text>
        </Text>

        <TouchableOpacity
          style={[styles.btnPrimary, styles.btnPremium]}
          onPress={() => handleSelectPlan("premium")}
        >
          <Text style={styles.btnPrimaryEmoji}>⭐</Text>
          <Text style={styles.btnPrimaryText}>Quiero ser Premium</Text>
          <Text style={styles.btnPremiumSub}>
            Acceso completo a todas las herramientas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => handleSelectPlan("free")}
        >
          <Text style={styles.btnSecondaryText}>
            Por el momento no, continuar gratis
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const GREEN = "#00a680";
const GREEN_DARK = "#007a60";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7f6" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 16,
  },
  noAuthEmoji: { fontSize: 64, marginBottom: 8 },
  noAuthTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  noAuthBody: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  bold: { fontWeight: "700", color: "#1a1a1a" },
  btnPrimary: {
    width: "100%",
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnPremium: { backgroundColor: GREEN_DARK },
  btnPrimaryEmoji: { fontSize: 32, marginBottom: 6 },
  btnPrimaryText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  btnPremiumSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  btnSecondary: { paddingVertical: 14, paddingHorizontal: 24 },
  btnSecondaryText: {
    fontSize: 15,
    color: "#888",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  cardPremium: {
    borderColor: GREEN,
    shadowColor: GREEN,
    shadowOpacity: 0.2,
  },
  cardEmoji: { fontSize: 48, marginBottom: 4 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardDetail: { fontSize: 16, color: "#444" },
  premiumText: { color: GREEN_DARK },
});
