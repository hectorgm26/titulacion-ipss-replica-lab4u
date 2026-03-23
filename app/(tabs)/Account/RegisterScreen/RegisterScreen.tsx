import RegisterForm from "@/components/Auth/RegisterForm/RegisterForm";
import { Image } from "expo-image";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen() {
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
          source={require("../../../../assets/images/abogando-logo.png")}
          style={styles.image}
        />

        <View style={styles.content}>
          <RegisterForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
