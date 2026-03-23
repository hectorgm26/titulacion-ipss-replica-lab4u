import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estamos en la Screen de Ranking</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "white",
  },
});
