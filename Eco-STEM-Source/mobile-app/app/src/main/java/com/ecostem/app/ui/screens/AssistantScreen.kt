package com.ecostem.app.ui.screens

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.components.GradientButton
import com.ecostem.app.ui.components.ScreenContainer
import com.ecostem.app.ui.components.SectionCard

@Composable
fun AssistantScreen(viewModel: EcoStemViewModel) {
    val state by viewModel.uiState.collectAsState()
    var message by remember { mutableStateOf("") }

    ScreenContainer(
        eyebrow = "Asistente IA vegetal",
        title = "Habla con tu asesor Eco-STEM",
        subtitle = "Consulta riego, plagas, especies, luz, sustratos y decisiones de cultivo con una interfaz mucho mas limpia."
    ) {
        SectionCard("Conversacion") {
            state.chatMessages.forEach { item ->
                val isUser = item.role == "user"
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isUser) Color(0xFF1A6D91) else Color(0xCC112845)
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        item.text,
                        color = Color.White,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
        SectionCard("Escribe tu pregunta") {
            OutlinedTextField(
                value = message,
                onValueChange = { message = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Pregunta sobre riego, plagas, luz o cultivo") }
            )
            GradientButton(
                text = if (state.isSendingChat) "Enviando..." else "Enviar mensaje",
                enabled = message.isNotBlank() && !state.isSendingChat
            ) {
                viewModel.sendChat(message)
                message = ""
            }
        }
    }
}
