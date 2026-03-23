import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function UserLoggedScreen() {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>UserLoggedScreen</Text>
      <Text style={styles.text}>¡Bienvenido! Has iniciado sesión.</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar Sesión" color="#ff4444" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000", // Fondo negro para que se vea el texto blanco
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});
