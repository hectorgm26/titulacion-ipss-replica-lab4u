import { Button, Text } from "@react-native-blossom-ui/components";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./UserGuestScreen.styles";

export default function UserGuestScreen() {
  return (
    <ScrollView
      centerContent={true}
      style={styles.content}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../../../assets/images/user-guest.png")}
        style={styles.image}
      />
      <Text style={styles.title}>¡Bienvenido a Lab4U!</Text>
      <Text style={styles.description}>
        Aprende ciencias con tu smartphone. Únete a Lab4U y descubre nuevas
        herramientas y experimentos antes que nadie.
      </Text>

      <View>
        <Link href={"/Account/LoginScreen/LoginScreen"} asChild>
          <Button title="Iniciar Sesión" style={styles.btnStyle} />
        </Link>
      </View>
    </ScrollView>
  );
}
