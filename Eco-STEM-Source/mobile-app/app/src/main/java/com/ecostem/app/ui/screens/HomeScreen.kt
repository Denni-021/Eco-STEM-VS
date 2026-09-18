package com.ecostem.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.components.AccentChip
import com.ecostem.app.ui.components.BrandLogoCard
import com.ecostem.app.ui.components.MetricStrip
import com.ecostem.app.ui.components.ScreenContainer
import com.ecostem.app.ui.components.SectionCard

@Composable
fun HomeScreen(viewModel: EcoStemViewModel) {
    val state by viewModel.uiState.collectAsState()

    ScreenContainer(
        eyebrow = "Plataforma vegetal con IA e IoT",
        title = "Plantas mas inteligentes, mas verdes",
        subtitle = "Controla analisis, monitoreo, recomendaciones y asistencia desde una experiencia movil mucho mas viva y premium."
    ) {
        BrandLogoCard("Emprendimiento de inteligencia vegetal para analisis, monitoreo y cuidado guiado.")
        AccentChip("IA vegetal")
        AccentChip("Clima local")
        AccentChip("Ubicacion exacta")
        AccentChip("Sensores IoT")

        MetricStrip("Estado del plan", state.session?.planStatus?.uppercase() ?: "INVITADO")
        MetricStrip("Imagenes listas", state.selectedImageCount.toString())
        MetricStrip("Sensor suelo", "${state.iotReading?.moisture ?: "--"}%")
        MetricStrip("Temperatura", "${state.iotReading?.temp ?: "--"} C")

        SectionCard("Resumen actual") {
            Text(state.recommendationsSummary, color = Color(0xFFD7E6F5))
            state.analysis?.summary?.let {
                Text("Ultimo analisis: $it", color = Color(0xFF7CF1E0), fontWeight = FontWeight.SemiBold)
            }
            state.successMessage?.let { Text(it, color = Color(0xFF46F6CB)) }
            state.errorMessage?.let { Text(it, color = Color(0xFFFFA3A3)) }
        }

        SectionCard("Impacto de la plataforma") {
            Text("99.9% precision", color = Color.White)
            Text("50K+ analisis", color = Color.White)
            Text("120+ especies", color = Color.White)
            Text("IA + IoT en campo", color = Color.White)
        }
    }
}
