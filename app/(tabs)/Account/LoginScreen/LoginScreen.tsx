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
        <Text style={styles.text}>Estamos en el login</Text>

        <Link href={"/Account/RegisterScreen/RegisterScreen"} asChild>
          <Text style={styles.text}>Registrarse</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
