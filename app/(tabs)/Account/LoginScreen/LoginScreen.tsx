import LoginForm from "@/components/Auth/LoginForm/LoginForm";
import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { Text } from "@react-native-blossom-ui/components";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  useFocusEffect(
    useCallback(() => {
      ToolsAnalytics.goToLoginView();
    }, []),
  );

  return (
    <ScrollView>
      <Image
        source={require("../../../../assets/images/lab4u_logo.jpeg")}
        style={styles.image}
      />

      <View style={styles.content}>
        <LoginForm />

        <Text style={styles.textRegister}>
          ¿Aún no tienes cuenta?{" "}
          <Link href={"/Account/RegisterScreen/RegisterScreen"} asChild>
            <Text style={styles.btnRegister}>Regístrate</Text>
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}
