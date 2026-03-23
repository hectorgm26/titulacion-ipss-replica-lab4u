import { Button, Icon, TextInput } from "@react-native-blossom-ui/components";
import React, { useState } from "react";
import { View } from "react-native";
import { styles } from "./RegisterForm.styles";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.content}>
      <TextInput
        textContentType="emailAddress"
        mode="flat"
        label="Correo Electrónico"
        placeholder="Ingrese su correo electrónico"
        right={<Icon name="at" color="white" />}
        inputTextStyle={{ color: "white" }}
        size="large"
        status="success"
      />

      <TextInput
        textContentType="password"
        mode="flat"
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        secureTextEntry={!showPassword}
        right={
          <Icon
            name={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
            color="white"
          />
        }
        inputTextStyle={{ color: "white" }}
        size="large"
        status="success"
      />

      <TextInput
        textContentType="password"
        mode="flat"
        label="Repetir contraseña"
        placeholder="Repetir contraseña"
        secureTextEntry={!showConfirmPassword}
        right={
          <Icon
            name={showConfirmPassword ? "eye" : "eye-off"}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            color="white"
          />
        }
        inputTextStyle={{ color: "white" }}
        size="large"
        status="success"
      />

      <View style={{ alignSelf: "center", marginTop: 20 }}>
        <Button title="Registrarse" style={styles.btn} />
      </View>
    </View>
  );
}
