package com.ecostem.app.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.components.AccentChip
import com.ecostem.app.ui.components.GradientButton
import com.ecostem.app.ui.components.ScreenContainer
import com.ecostem.app.ui.components.SectionCard

@Composable
fun AnalyzerScreen(viewModel: EcoStemViewModel) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val selectedImages = remember { mutableStateListOf<Uri>() }

    val picker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickMultipleVisualMedia(maxItems = 3)
    ) { uris ->
        selectedImages.clear()
        selectedImages.addAll(uris)
    }

    ScreenContainer(
        eyebrow = "Analisis con IA",
        title = "Diagnostico visual mas preciso",
        subtitle = "Sube hasta 3 imagenes y deja que Eco-STEM identifique estres, signos visibles y especie probable."
    ) {
        AccentChip("Hasta 3 imagenes")
        AccentChip("Vision inteligente")

        SectionCard("Carga tus imagenes") {
            Text("Imagenes seleccionadas: ${selectedImages.size}", color = Color.White, fontWeight = FontWeight.SemiBold)
            GradientButton("Elegir imagenes") {
                picker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
            }
            GradientButton(
                text = if (state.isAnalyzing) "Analizando..." else "Analizar planta",
                enabled = selectedImages.isNotEmpty() && !state.isAnalyzing
            ) {
                viewModel.analyzeImages(context.contentResolver, selectedImages)
            }
            if (state.isAnalyzing) {
                CircularProgressIndicator(color = Color(0xFF46F6CB))
            }
        }

        state.analysis?.let { analysis ->
            SectionCard("Resultado del analisis") {
                Text(analysis.summary ?: "Sin resumen.", color = Color(0xFFD7E6F5))
                Text("Severidad: ${analysis.severity ?: "No definida"}", color = Color(0xFF7CF1E0))
                Text("Confianza: ${((analysis.confidence ?: 0.0) * 100).toInt()}%", color = Color(0xFF7CF1E0))
                if (analysis.probableSpecies.isNotEmpty()) {
                    Text("Especie probable: ${analysis.probableSpecies.joinToString()}", color = Color.White)
                }
                if (analysis.signs.isNotEmpty()) {
                    Text("Signos visibles: ${analysis.signs.joinToString()}", color = Color.White)
                }
                if (analysis.recommendations.isNotEmpty()) {
                    Text("Acciones sugeridas", color = Color.White, fontWeight = FontWeight.Bold)
                    analysis.recommendations.take(4).forEach {
                        Text("- $it", color = Color(0xFFD7E6F5))
                    }
                }
            }
        }

        state.errorMessage?.let { Text(it, color = Color(0xFFFFA3A3)) }
    }
}
