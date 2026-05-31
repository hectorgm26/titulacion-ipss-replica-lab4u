import { ToolsAnalytics } from "@/lib/analytics/toolsAnalytics";
import { Button, Icon, TextInput } from "@react-native-blossom-ui/components";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { initialValues, validationSchema } from "./LoginForm.data";
import { styles } from "./LoginForm.styles";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password,
        );

        ToolsAnalytics.loginSuccess();
        // Dismiss entire Account stack first, then navigate to Deal
        router.dismissAll();
        router.replace("/(tabs)/Deal");
      } catch (error) {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "🚨 Usuario o contraseña incorrectos.",
        });
        console.log(error);
      }
    },
  });

  return (
    <View style={styles.content}>
      <TextInput
        mode="flat"
        placeholder="Correo electrónico"
        textContentType="emailAddress"
        inputTextStyle={{ color: "white" }}
        size="large"
        right={<Icon name="at" color="white" />}
        onChangeText={(text) => formik.setFieldValue("email", text)}
        value={formik.values.email}
        error={formik.touched.email ? formik.errors.email : ""}
        status={
          formik.touched.email && formik.errors.email ? "error" : "success"
        }
      />

      <TextInput
        mode="flat"
        placeholder="Contraseña"
        textContentType="password"
        inputTextStyle={{ color: "white" }}
        size="large"
        secureTextEntry={!showPassword}
        right={
          <Icon
            name={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
            color="white"
          />
        }
        onChangeText={(text) => formik.setFieldValue("password", text)}
        value={formik.values.password}
        error={formik.touched.password ? formik.errors.password : ""}
        status={
          formik.touched.password && formik.errors.password
            ? "error"
            : "success"
        }
      />

      <View style={{ alignSelf: "center", marginTop: 20 }}>
        <Button
          title="Iniciar Sesión"
          style={styles.btn}
          onPress={() => formik.handleSubmit()}
          isLoading={formik.isSubmitting}
        />
      </View>
    </View>
  );
}
