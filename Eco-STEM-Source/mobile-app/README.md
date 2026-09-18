# Eco-STEM Android

Aplicación móvil nativa hecha con **Android Studio + Kotlin + Jetpack Compose**.

## Qué incluye esta base

- Inicio visual de Eco-STEM
- Analizador de plantas por imagen
- Recomendador de qué sembrar según contexto
- Panel IoT con ubicación exacta
- Asistente inteligente
- Cuenta, login, registro y compra de membresías

## Cómo abrirla

1. Abre **Android Studio**
2. Elige **Open**
3. Selecciona esta carpeta:

`E:\Eco-STEM-Source\mobile-app`

4. Deja que Android Studio haga el `Gradle Sync`

## Antes de correrla

En este archivo:

`E:\Eco-STEM-Source\mobile-app\app\build.gradle.kts`

busca esta línea:

```kotlin
buildConfigField("String", "API_BASE_URL", "\"http://192.168.100.8:4000/api/\"")
```

y cambia la IP por la IP real de tu computadora si vas a probar con tu celular o emulador.

## Backend

Debes tener corriendo el backend en:

`E:\Eco-STEM-Source\server`

con:

```powershell
npm install
npm run dev
```

## Nota

Esta es una base nativa seria para continuar el proyecto móvil sin Expo. Si quieres, el siguiente paso puede ser:

- cámara real dentro del analizador
- historial persistente con Room
- notificaciones push
- diseño todavía más premium
