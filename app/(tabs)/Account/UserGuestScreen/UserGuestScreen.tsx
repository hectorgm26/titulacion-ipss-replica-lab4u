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
      <Text style={styles.title}>Consultar tu perfil de Abogando</Text>
      <Text style={styles.description}>
        ¿Como describirias el mejor abogado?. Busca los mejores abogados de
        Chile de una forma sencilla, vota cual te ha dado el mejor servicio y
        comenta tu experiencia con otros usuarios.
      </Text>

      <View>
        <Link href={"/Account/LoginScreen/LoginScreen"} asChild>
          <Button title="Ver tu perfil" style={styles.btnStyle} />
        </Link>
      </View>
    </ScrollView>
  );
}
