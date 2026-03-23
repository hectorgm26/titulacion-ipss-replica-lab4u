import { Button } from "@react-native-blossom-ui/components";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Abogados() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estamos en la Screen de Abogados</Text>
      <Link href="/(tabs)/Abogados/AddAbogadoScreen" asChild>
        <Button
          title="Crear Abogado"
          size="medium"
          style={{ alignSelf: "center" }}
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "white",
    marginBottom: 20,
  },
});
