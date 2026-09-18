package com.ecostem.app.ui.screens

import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.layout.fillMaxWidth
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.components.GradientButton
import com.ecostem.app.ui.components.ScreenContainer
import com.ecostem.app.ui.components.SectionCard

@Composable
fun PlannerScreen(viewModel: EcoStemViewModel) {
    val state by viewModel.uiState.collectAsState()
    val planner = state.planner

    ScreenContainer(
        eyebrow = "Recomendador contextual",
        title = "Que sembrar segun tu realidad",
        subtitle = "Filtra por objetivo, espacio, luz y manejo para recibir sugerencias mas utiles y accionables."
    ) {
        SectionCard("Configura tu espacio") {
            OutlinedTextField(
                value = planner.goal,
                onValueChange = { viewModel.updatePlanner { copy(goal = it) } },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Objetivo: edible, ornamental, flowers...") }
            )
            OutlinedTextField(
                value = planner.space,
                onValueChange = { viewModel.updatePlanner { copy(space = it) } },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Espacio: indoor, balcony, yard...") }
            )
            OutlinedTextField(
                value = planner.light,
                onValueChange = { viewModel.updatePlanner { copy(light = it) } },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Luz: low, medium, direct") }
            )
            OutlinedTextField(
                value = planner.care,
                onValueChange = { viewModel.updatePlanner { copy(care = it) } },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Cuidado: low, medium, high") }
            )
            GradientButton(
                text = if (state.isLoadingRecommendations) "Generando..." else "Generar recomendaciones",
                enabled = !state.isLoadingRecommendations
            ) {
                viewModel.generateRecommendations()
            }
        }

        SectionCard("Recomendacion principal") {
            Text(state.recommendationsSummary, color = Color(0xFFD7E6F5))
            if (state.recommendations.isEmpty()) {
                Text("Todavia no hay sugerencias. Genera una recomendacion para ver opciones ideales para tu caso.", color = Color(0xFF8FA6C0))
            } else {
                val first = state.recommendations.first()
                Text(first.name, color = Color.White, fontWeight = FontWeight.ExtraBold)
                Text(first.reason ?: "Sin detalle adicional.", color = Color(0xFFD7E6F5))
                Text("Afinidad: ${first.score ?: 0}%", color = Color(0xFF46F6CB))
                first.careTips.take(3).forEach { tip ->
                    Text("- $tip", color = Color(0xFFD7E6F5))
                }
            }
        }

        if (state.recommendations.size > 1) {
            SectionCard("Alternativas") {
                state.recommendations.drop(1).take(3).forEach { item ->
                    Text("${item.name}: ${item.reason ?: "Buena opcion para tu contexto."}", color = Color(0xFFD7E6F5))
                }
            }
        }
    }
}
