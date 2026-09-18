package com.ecostem.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ecostem.app.data.AccountFormState
import com.ecostem.app.data.PurchasePlan
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.components.BrandLogoCard
import com.ecostem.app.ui.components.GradientButton
import com.ecostem.app.ui.components.ScreenContainer
import com.ecostem.app.ui.components.SectionCard

private enum class AccountMode {
    REGISTER,
    LOGIN
}

@Composable
fun AccountScreen(viewModel: EcoStemViewModel) {
    val state by viewModel.uiState.collectAsState()
    var register by rememberSaveable { mutableStateOf(AccountFormState()) }
    var loginIdentifier by rememberSaveable { mutableStateOf("") }
    var loginPassword by rememberSaveable { mutableStateOf("") }
    var purchasePassword by rememberSaveable { mutableStateOf("") }
    var mode by rememberSaveable { mutableStateOf(AccountMode.REGISTER) }

    ScreenContainer(
        eyebrow = "Cuenta y membresias",
        title = "Accede a tu espacio Eco-STEM",
        subtitle = "Una experiencia mas profesional para crear cuenta, entrar al sistema y activar tu membresia dentro de la app."
    ) {
        BrandLogoCard("Gestiona tu acceso, tu plan y tu identidad digital dentro del ecosistema Eco-STEM.")

        SectionCard("Bienvenido") {
            Text(
                "Desde aqui puedes crear tu cuenta, iniciar sesion y activar el plan que mejor se adapte a ti.",
                color = Color(0xFFD7E6F5)
            )
            AccountSegmentedTabs(
                selected = mode,
                onSelect = { mode = it }
            )
        }

        state.session?.let { session ->
            SectionCard("Sesion actual") {
                Text("Hola, ${session.firstName ?: "Usuario"}", color = Color.White, fontWeight = FontWeight.Bold)
                Text("Correo: ${session.email ?: "Sin correo"}", color = Color(0xFFD7E6F5))
                Text("Plan actual: ${session.planStatus ?: "free"}", color = Color(0xFF46F6CB))
                state.activeSubscription?.let {
                    Text("Suscripcion: ${it.planName} (${it.status})", color = Color(0xFFD7E6F5))
                }
                GradientButton("Cerrar sesion") { viewModel.logout() }
            }
        }

        if (mode == AccountMode.REGISTER) {
            SectionCard("Crear cuenta") {
                Text("Registra tu perfil para guardar analisis, recomendaciones, membresias y avances.", color = Color(0xFFD7E6F5))
                OutlinedTextField(
                    value = register.firstName,
                    onValueChange = { register = register.copy(firstName = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Nombre") }
                )
                OutlinedTextField(
                    value = register.lastName,
                    onValueChange = { register = register.copy(lastName = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Apellido") }
                )
                OutlinedTextField(
                    value = register.email,
                    onValueChange = { register = register.copy(email = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Correo electronico") }
                )
                OutlinedTextField(
                    value = register.phone,
                    onValueChange = { register = register.copy(phone = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Telefono") }
                )
                OutlinedTextField(
                    value = register.password,
                    onValueChange = { register = register.copy(password = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Contrasena") }
                )
                GradientButton(
                    text = if (state.isAuthenticating) "Creando cuenta..." else "Registrarme en Eco-STEM",
                    enabled = !state.isAuthenticating
                ) {
                    viewModel.register(register)
                }
            }
        } else {
            SectionCard("Iniciar sesion") {
                Text("Entra con tu correo o telefono para continuar con tu panel, tu analizador y tus planes.", color = Color(0xFFD7E6F5))
                OutlinedTextField(
                    value = loginIdentifier,
                    onValueChange = { loginIdentifier = it },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Correo o telefono") }
                )
                OutlinedTextField(
                    value = loginPassword,
                    onValueChange = { loginPassword = it },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Contrasena") }
                )
                GradientButton(
                    text = if (state.isAuthenticating) "Ingresando..." else "Entrar a mi cuenta",
                    enabled = !state.isAuthenticating
                ) {
                    viewModel.login(loginIdentifier, loginPassword)
                }
            }
        }

        SectionCard("Activar membresia") {
            Text("Activa tu plan desde la app y desbloquea la experiencia completa de Eco-STEM.", color = Color(0xFFD7E6F5))
            OutlinedTextField(
                value = purchasePassword,
                onValueChange = { purchasePassword = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Contrasena para confirmar compra") }
            )
            PlanButton("Plan Mensual - $1.99", PurchasePlan("monthly", "Plan Mensual", 1.99), purchasePassword, state.isPurchasing, viewModel)
            PlanButton("Plan Semestral - $3.99", PurchasePlan("semiannual", "Plan Semestral", 3.99), purchasePassword, state.isPurchasing, viewModel)
            PlanButton("Plan Anual - $5.99", PurchasePlan("annual", "Plan Anual", 5.99), purchasePassword, state.isPurchasing, viewModel)
        }

        state.successMessage?.let { Text(it, color = Color(0xFF46F6CB), fontWeight = FontWeight.SemiBold) }
        state.errorMessage?.let { Text(it, color = Color(0xFFFFA3A3), fontWeight = FontWeight.SemiBold) }
    }
}

@Composable
private fun AccountSegmentedTabs(
    selected: AccountMode,
    onSelect: (AccountMode) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xCC0A1828), RoundedCornerShape(18.dp))
            .padding(6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        AccountTab(
            label = "Registrarse",
            selected = selected == AccountMode.REGISTER,
            onClick = { onSelect(AccountMode.REGISTER) },
            modifier = Modifier.weight(1f)
        )
        AccountTab(
            label = "Iniciar sesion",
            selected = selected == AccountMode.LOGIN,
            onClick = { onSelect(AccountMode.LOGIN) },
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun AccountTab(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(
                if (selected) {
                    Brush.horizontalGradient(listOf(Color(0xFF1BE7CF), Color(0xFF56B8FF)))
                } else {
                    Brush.horizontalGradient(listOf(Color(0x001BE7CF), Color(0x001BE7CF)))
                },
                RoundedCornerShape(14.dp)
            )
            .clickable(onClick = onClick)
            .padding(vertical = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            label,
            color = if (selected) Color(0xFF07111F) else Color(0xFFD7E6F5),
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun PlanButton(
    label: String,
    plan: PurchasePlan,
    password: String,
    isPurchasing: Boolean,
    viewModel: EcoStemViewModel
) {
    GradientButton(
        text = if (isPurchasing) "Procesando..." else label,
        enabled = !isPurchasing && password.isNotBlank()
    ) {
        viewModel.purchasePlan(plan, password)
    }
}
