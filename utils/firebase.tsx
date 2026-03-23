import { initializeApp } from "firebase/app";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDa1VtSGznLfSly7pGPfD2JfzM0bzoLKaw",
  authDomain: "abogando-v1.firebaseapp.com",
  projectId: "abogando-v1",
  storageBucket: "abogando-v1.firebasestorage.app",
  messagingSenderId: "754839949954",
  appId: "1:754839949954:web:3ddc66b90edcc1268a9a9b",
};

export const initFirebase = initializeApp(firebaseConfig);

// Configuración con persistencia para que no se olvide la sesión
export const auth = initializeAuth(initFirebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
