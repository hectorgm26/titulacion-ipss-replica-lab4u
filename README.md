# Proyecto Replicable de Práctica Profesional

## Contexto y justificación de esta implementación

El proyecto real de práctica profesional fue desarrollado en **Lab4U**, empresa chilena de tecnología educativa, como desarrollador mobile nativo iOS utilizando **Swift, SwiftUI y UIKit**.

La implementación original en la empresa incluyó:
- Integración de **Firebase Cloud Messaging** con topics segmentados por perfil de usuario. No obstante luego se migró a una solución hibrida, donde el areá de backend de la empresa, interactua mediante endpoints internos con los servicios de Firebase, mientras que mobile solo consume esos endpoints para la recepción de notificaciones.
- Mejora del sistema de tracking de eventos con **Mixpanel** (llamado internamente "Lote 14")

Sin embargo, para cumplir con el requisito institucional de entregar un **proyecto replicable y ejecutable por los profesores evaluadores**, el proyecto iOS original presenta las siguientes restricciones que lo hacen inviable para evaluación externa:

### ¿Por qué el proyecto iOS no puede ser evaluado directamente?

1. **Licencia de Apple Developer obligatoria** — Para que las push notifications funcionen en iOS, la app debe estar firmada con un certificado de Apple Developer. Esta licencia tiene un costo de **USD $99 al año** y debe ser contratada por el desarrollador o la empresa. Sin ella, las notificaciones push simplemente no funcionan.

2. **Requiere Mac obligatoriamente** — El desarrollo y compilación de apps iOS nativas requiere obligatoriamente del sistema macOS (solo disponible en dispositivos MAC), con Xcode instalado. No existe forma de compilar ni correr un proyecto iOS en Windows o Linux. No todos los profesores evaluadores cuentan con un equipo Mac.

3. **Requiere App Store Connect** — Para activar las capacidades de push notifications en iOS es necesario configurar manualmente certificates, provisioning profiles y APNs keys en el portal de Apple Developer y App Store Connect, un proceso que requiere acceso a la cuenta de la empresa y conocimiento técnico específico de iOS.

4. **Backend propietario de Lab4U** — La arquitectura final del sistema en producción evolucionó a que el backend de la empresa maneja tokens FCM internos a través de endpoints propios. Estos endpoints son privados y no pueden ser expuestos a terceros fuera de la organización, lo que impide que un evaluador externo pueda correr el flujo completo.

### Decisión tomada

Previa conversación y acuerdo con el **profesor guía**, se decidió **replicar el proyecto desarrollado en la empresa** utilizando una tecnología accesible para cualquier evaluador: **React Native con Expo**, corriendo en Android.

Esta decisión permite:
- Correr el proyecto en **cualquier sistema operativo** (macOS, Windows, Linux)
- No requerir licencias de pago
- No depender de un backend propio de una empresa, con sus endpoints privados, simulando este mismo comportamiento mediante AsyncStorage local
- Usar un emulador Android gratuito incluido en Android Studio
- Demostrar de forma funcional y evaluable los mismos conceptos técnicos implementados en la empresa: FCM topics, Mixpanel, autenticación con Firebase y arquitectura de perfil de usuario

> **Importante:** Esta aplicación replica conceptualmente lo implementado en Lab4UApp (iOS). El proyecto real en la empresa ya fue desarrollado, desplegado a producción y documentado en el informe de práctica correspondiente.

---

## Requisitos previos del sistema

Antes de correr el proyecto, asegúrate de tener instalado lo siguiente:

### Software obligatorio

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18 o superior | https://nodejs.org |
| Android Studio | Ladybug (2024) o superior | https://developer.android.com/studio |
| JDK | 17 o 21 | incluido en Android Studio |

### Dentro de Android Studio

1. Abre Android Studio → **SDK Manager** (ícono en la barra superior)
2. En la pestaña **SDK Platforms**, instala **Android 14 (API 34)**
3. En la pestaña **SDK Tools**, verifica que estén instalados:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools

### Variables de entorno (macOS/Linux)

Agrega esto a tu `~/.zshrc` o `~/.bashrc` mediante el comando:

```bash
open -e ~/.zshrc
```

Después pega lo siguiente:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Luego recarga con `source ~/.zshrc`.

### Variables de entorno (Windows)

En Variables de entorno del sistema agrega:
- `ANDROID_HOME` → `C:\Users\TuUsuario\AppData\Local\Android\Sdk`
- Agrega a `PATH` → `%ANDROID_HOME%\platform-tools`
- Agrega a `PATH` → `%ANDROID_HOME%\emulator`
- Agrega a `PATH` → `%ANDROID_HOME%\cmdline-tools\latest\bin`

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/hectorgm26/titulacion-ipss-replica-lab4u.git
cd titulacion-ipss-replica-lab4u
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Generar código nativo Android

Este comando genera la carpeta `android/` con la configuración nativa necesaria para Firebase Messaging. Solo es necesario la primera vez o cuando se modifica el archivo `app.json`:

```bash
npx expo prebuild --clean --platform android
```

> Si pregunta por el package name, confirma: `com.anonymous.Abogando`

### 4. Crear y abrir un emulador Android

1. Abre **Android Studio**
2. Click en **Device Manager** (ícono de teléfono en la barra derecha)
3. Click **"+"** → **Create Virtual Device**
4. Elige **Pixel 8** → Next
5. Elige sistema operativo **Android 14 (API 34)** → Next → Finish
6. Click el ícono ▶ para iniciar el emulador

### 5. Correr la aplicación

Con el emulador corriendo:

```bash
npx expo run:android
```

La primera compilación tarda entre 5 y 10 minutos. Las siguientes son más rápidas.

---

## Flujo de uso para demostración

Una vez que la app esté corriendo:

1. **Cuenta** → Regístrate o inicia sesión con email y contraseña
2. **Plan de Usuario** → Elige si eres Estudiante o Profesor, y si quieres plan Free o Premium
3. **Notificaciones** → Activa el toggle para suscribirte al topic de Firebase Messaging
   - Al entrar a la pantalla, se debe activar el toggle, luego saldra un mensaje de que es necesario ir a los ajustes del sistema.
   - Al aparecer ese mensaje, se debe apretar el boton Ajustes, y luego ir al apartado de Notificaciones, y activar el boton toggle. De esta forma la app ya podrá recibirlas.
4. **Herramientas** → Explora las herramientas disponibles (las Premium requieren plan Premium)

### Topics activos de Firebase por perfil

El topic al que se suscribe el dispositivo se construye automáticamente según el perfil elegido:

```
usergroup_FREE_usertype_STUDENT_lang_es
usergroup_FREE_usertype_TEACHER_lang_es
usergroup_PREMIUM_usertype_STUDENT_lang_es
usergroup_PREMIUM_usertype_TEACHER_lang_es
```

Para enviar una notificación de prueba: Firebase Console → Messaging → New campaign → Notification → Target: Topic → escribe el topic correspondiente al perfil elegido.

---

## Tecnologías utilizadas

- **React Native + Expo SDK 54** — framework móvil multiplataforma
- **Expo Router** — navegación basada en archivos
- **Firebase Auth** — autenticación de usuarios
- **@react-native-firebase/messaging** — push notifications con FCM topics
- **Mixpanel** — tracking de eventos de usuario
- **AsyncStorage** — persistencia local de perfil y notificaciones
- **TypeScript** — tipado estático

---

## Notas importantes

- El proyecto requiere **build nativo** (`npx expo run:android`) para que funcionen las push notifications reales. No funciona con Expo Go para esta funcionalidad específica.
- El resto de la app (autenticación, herramientas, Mixpanel) sí funciona en Expo Go con `npx expo start`.
- El archivo `google-services.json` está incluido en el repositorio para facilitar la evaluación.
