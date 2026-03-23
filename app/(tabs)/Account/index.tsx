import LoadingModal from "@/components/LoadingModal/LoadingModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import UserGuestScreen from "./UserGuestScreen/UserGuestScreen";
import UserLoggedScreen from "./UserLoggedScreen";

export default function Account() {
  const [hasLogged, setHasLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();

    // Cada vez que el usuario y su valor cambie, se va a ejecutar esta función
    onAuthStateChanged(auth, (user) => {
      setHasLogged(user ? true : false);
    });
  }, []);

  if (hasLogged === null) {
    return <LoadingModal show text="Cargando" />;
  }

  return hasLogged ? <UserLoggedScreen /> : <UserGuestScreen />;
}
