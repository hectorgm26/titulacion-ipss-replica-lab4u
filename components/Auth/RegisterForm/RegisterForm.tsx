import { Button, Icon, TextInput } from "@react-native-blossom-ui/components";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useFormik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";
import { initialValues, validationSchema } from "./RegisterForm.data";
import { styles } from "./RegisterForm.styles";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(
          auth,
          formValue.email,
          formValue.password,
        );
        router.back();
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
      }
    },
  });

  return (
    <View style={styles.content}>
      <TextInput
        textContentType="emailAddress"
        mode="flat"
        placeholder="Ingrese su correo electrónico"
        right={<Icon name="at" color="white" />}
        inputTextStyle={{ color: "white" }}
        size="large"
        onChangeText={(text) => formik.setFieldValue("email", text)}
        value={formik.values.email}
        error={formik.touched.email ? formik.errors.email : ""}
        status={
          formik.touched.email && formik.errors.email ? "error" : "success"
        }
      />

      <TextInput
        textContentType="password"
        mode="flat"
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
        onChangeText={(text) => formik.setFieldValue("password", text)}
        value={formik.values.password}
        error={formik.touched.password ? formik.errors.password : ""}
        status={
          formik.touched.password && formik.errors.password
            ? "error"
            : "success"
        }
      />

      <TextInput
        textContentType="password"
        mode="flat"
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
        onChangeText={(text) => formik.setFieldValue("repeatPassword", text)}
        value={formik.values.repeatPassword}
        error={
          formik.touched.repeatPassword ? formik.errors.repeatPassword : ""
        }
        status={
          formik.touched.repeatPassword && formik.errors.repeatPassword
            ? "error"
            : "success"
        }
      />

      <View style={{ alignSelf: "center", marginTop: 20 }}>
        <Button
          title="Registrarse"
          style={styles.btn}
          onPress={() => formik.handleSubmit()}
          isLoading={formik.isSubmitting}
        />
      </View>
    </View>
  );
}
