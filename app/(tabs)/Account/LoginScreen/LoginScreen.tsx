import LoginForm from "@/components/Auth/LoginForm/LoginForm";
import { Text } from "@react-native-blossom-ui/components";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  return (
    <ScrollView>
      <Image
        source={require("../../../../assets/images/abogando-logo.png")}
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
