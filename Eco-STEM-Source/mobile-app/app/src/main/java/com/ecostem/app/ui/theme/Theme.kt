package com.ecostem.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkScheme = darkColorScheme(
    primary = AquaAccent,
    secondary = SkyAccent,
    tertiary = Color(0xFF9E6BFF),
    background = DeepNavy,
    surface = OceanCard,
    onPrimary = DeepNavy,
    onBackground = SoftText,
    onSurface = SoftText
)

private val LightScheme = lightColorScheme(
    primary = AquaAccent,
    secondary = SkyAccent,
    background = DeepNavy,
    surface = OceanCard,
    onPrimary = DeepNavy,
    onBackground = SoftText,
    onSurface = SoftText
)

@Composable
fun EcoStemTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) DarkScheme else LightScheme,
        typography = Typography,
        content = content
    )
}
