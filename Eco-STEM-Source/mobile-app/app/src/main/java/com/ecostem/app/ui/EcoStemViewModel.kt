package com.ecostem.app.ui

import android.content.ContentResolver
import android.net.Uri
import android.util.Base64
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ecostem.app.data.AccountFormState
import com.ecostem.app.data.AnalysisRequest
import com.ecostem.app.data.AuthRequest
import com.ecostem.app.data.ChatMessage
import com.ecostem.app.data.ChatRequest
import com.ecostem.app.data.Coords
import com.ecostem.app.data.EcoStemUiState
import com.ecostem.app.data.IoTRequest
import com.ecostem.app.data.PlannerFormState
import com.ecostem.app.data.PurchasePlan
import com.ecostem.app.data.PurchaseRequest
import com.ecostem.app.data.RecommendationFilters
import com.ecostem.app.data.RecommendationLocation
import com.ecostem.app.data.RecommendationRequest
import com.ecostem.app.data.SubscriptionInfo
import com.ecostem.app.network.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class EcoStemViewModel : ViewModel() {
    private val api = ApiClient.service

    private val _uiState = MutableStateFlow(EcoStemUiState())
    val uiState: StateFlow<EcoStemUiState> = _uiState.asStateFlow()

    fun updatePlanner(update: PlannerFormState.() -> PlannerFormState) {
        _uiState.update { current ->
            current.copy(planner = current.planner.update(), errorMessage = null, successMessage = null)
        }
    }

    fun clearMessages() {
        _uiState.update { it.copy(errorMessage = null, successMessage = null) }
    }

    fun register(form: AccountFormState) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthenticating = true, errorMessage = null, successMessage = null) }
            runCatching {
                api.register(
                    AuthRequest(
                        firstName = form.firstName,
                        lastName = form.lastName,
                        email = form.email.ifBlank { null },
                        phone = form.phone.ifBlank { null },
                        password = form.password
                    )
                )
            }.onSuccess { response ->
                _uiState.update {
                    it.copy(
                        isAuthenticating = false,
                        token = response.token,
                        session = response.user,
                        successMessage = "Cuenta creada correctamente."
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isAuthenticating = false,
                        errorMessage = error.message ?: "No se pudo crear la cuenta."
                    )
                }
            }
        }
    }

    fun login(identifier: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthenticating = true, errorMessage = null, successMessage = null) }
            runCatching {
                api.login(
                    AuthRequest(
                        email = identifier.takeIf { it.contains("@") },
                        phone = identifier.takeIf { !it.contains("@") },
                        password = password
                    )
                )
            }.onSuccess { response ->
                _uiState.update {
                    it.copy(
                        isAuthenticating = false,
                        token = response.token,
                        session = response.user,
                        successMessage = "Inicio de sesión correcto."
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isAuthenticating = false,
                        errorMessage = error.message ?: "No se pudo iniciar sesión."
                    )
                }
            }
        }
    }

    fun logout() {
        _uiState.update {
            it.copy(
                token = null,
                session = null,
                activeSubscription = null,
                successMessage = "Sesión cerrada."
            )
        }
    }

    fun sendChat(message: String) {
        if (message.isBlank()) return
        val outgoing = ChatMessage("user", message)
        _uiState.update {
            it.copy(
                chatMessages = it.chatMessages + outgoing,
                isSendingChat = true,
                errorMessage = null,
                successMessage = null
            )
        }
        viewModelScope.launch {
            runCatching {
                api.sendChat(ChatRequest(message = message))
            }.onSuccess { response ->
                _uiState.update {
                    it.copy(
                        isSendingChat = false,
                        chatMessages = it.chatMessages + ChatMessage("assistant", response.answer)
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isSendingChat = false,
                        chatMessages = it.chatMessages + ChatMessage(
                            "assistant",
                            "No pude conectarme al backend ahora mismo. Revisa que el servidor de Eco-STEM esté encendido."
                        ),
                        errorMessage = error.message ?: "No se pudo enviar el mensaje."
                    )
                }
            }
        }
    }

    fun generateRecommendations(location: RecommendationLocation? = null) {
        val planner = uiState.value.planner
        _uiState.update {
            it.copy(isLoadingRecommendations = true, errorMessage = null, successMessage = null)
        }
        viewModelScope.launch {
            runCatching {
                api.getRecommendations(
                    RecommendationRequest(
                        filters = RecommendationFilters(
                            goal = planner.goal,
                            space = planner.space,
                            light = planner.light,
                            care = planner.care,
                            experience = planner.experience,
                            climatePriority = planner.climatePriority
                        ),
                        location = location,
                        sensors = uiState.value.iotReading
                    )
                )
            }.onSuccess { response ->
                _uiState.update {
                    it.copy(
                        isLoadingRecommendations = false,
                        recommendationsSummary = response.summary
                            ?: "Estas plantas se ajustan mejor a tus condiciones actuales.",
                        recommendations = response.recommendations
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoadingRecommendations = false,
                        errorMessage = error.message ?: "No pude generar recomendaciones.",
                        recommendations = emptyList()
                    )
                }
            }
        }
    }

    fun updateLocationAndLoadIoT(lat: Double, lon: Double, accuracy: Float?) {
        _uiState.update {
            it.copy(isLoadingIoT = true, errorMessage = null, successMessage = "Ubicación obtenida, ajustando sensores...")
        }
        viewModelScope.launch {
            runCatching {
                api.simulateIoT(
                    IoTRequest(
                        userId = uiState.value.session?.userId,
                        location = RecommendationLocation(
                            coords = Coords(lat = lat, lon = lon, accuracy = accuracy),
                            terrain = "urbano montañoso",
                            elevation = 1170.0
                        )
                    )
                )
            }.onSuccess { reading ->
                _uiState.update {
                    it.copy(
                        isLoadingIoT = false,
                        iotReading = reading,
                        iotStatus = "Ubicación activa. Sensores ajustados al contexto local."
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isLoadingIoT = false,
                        errorMessage = error.message ?: "No se pudieron actualizar los sensores.",
                        iotStatus = "No fue posible obtener el panel IoT con tu ubicación."
                    )
                }
            }
        }
    }

    fun analyzeImages(contentResolver: ContentResolver, uris: List<Uri>) {
        if (uris.isEmpty()) return
        _uiState.update {
            it.copy(
                isAnalyzing = true,
                selectedImageCount = uris.size,
                errorMessage = null,
                successMessage = null
            )
        }
        viewModelScope.launch {
            runCatching {
                val images = uris.map { uri ->
                    val bytes = contentResolver.openInputStream(uri)?.use { stream -> stream.readBytes() } ?: ByteArray(0)
                    "data:image/jpeg;base64,${Base64.encodeToString(bytes, Base64.NO_WRAP)}"
                }.filter { it.isNotBlank() }
                api.analyzePlant(
                    AnalysisRequest(
                        images = images,
                        context = mapOf("source" to "android-app", "wantsSpecies" to true)
                    )
                )
            }.onSuccess { response ->
                _uiState.update {
                    it.copy(
                        isAnalyzing = false,
                        analysis = response,
                        successMessage = "Análisis completado."
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isAnalyzing = false,
                        errorMessage = error.message ?: "No se pudo analizar la planta."
                    )
                }
            }
        }
    }

    fun purchasePlan(plan: PurchasePlan, password: String, paymentMethod: String = "visa") {
        val session = uiState.value.session ?: run {
            _uiState.update { it.copy(errorMessage = "Primero inicia sesión para activar tu membresía.") }
            return
        }
        _uiState.update { it.copy(isPurchasing = true, errorMessage = null, successMessage = null) }
        viewModelScope.launch {
            runCatching {
                api.purchase(
                    PurchaseRequest(
                        userId = session.userId,
                        plan = plan,
                        planCode = plan.code,
                        planName = plan.name,
                        amount = plan.price,
                        currency = "USD",
                        paymentMethod = paymentMethod,
                        email = session.email.orEmpty(),
                        password = password,
                        card = mapOf("brand" to paymentMethod, "last4" to "4242")
                    )
                )
            }.onSuccess { response ->
                _uiState.update {
                    it.copy(
                        isPurchasing = false,
                        session = response.user ?: it.session,
                        activeSubscription = response.subscription,
                        successMessage = "Plan ${plan.name} activado correctamente."
                    )
                }
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isPurchasing = false,
                        errorMessage = error.message ?: "No se pudo activar el plan."
                    )
                }
            }
        }
    }

    fun preloadDemo() {
        if (uiState.value.recommendations.isNotEmpty()) return
        _uiState.update {
            it.copy(
                recommendationsSummary = "Puedes usar el recomendador para descubrir plantas según luz, espacio y clima local.",
                activeSubscription = SubscriptionInfo(
                    planCode = "monthly",
                    planName = "Plan Mensual",
                    status = "demo",
                    startDate = "",
                    endDate = ""
                )
            )
        }
    }
}
