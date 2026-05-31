import RegisterForm from "@/components/Auth/RegisterForm/RegisterForm";
import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { Text } from "@react-native-blossom-ui/components";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useCallback } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen() {
  useFocusEffect(
    useCallback(() => {
      ToolsAnalytics.goToRegisterView();
    }, []),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Image
          source={require("../../../../assets/images/lab4u_logo.jpeg")}
          style={styles.image}
        />

        <View style={styles.content}>
          <RegisterForm />

          <Text style={styles.textRegister}>
            ¿Ya tienes cuenta?{" "}
            <Link href={"/Account/LoginScreen/LoginScreen"} asChild>
              <Text style={styles.btnRegister}>Inicia sesión</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
