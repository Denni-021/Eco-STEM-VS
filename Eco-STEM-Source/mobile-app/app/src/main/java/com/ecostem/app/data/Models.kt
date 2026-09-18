package com.ecostem.app.data

data class ChatRequest(
    val message: String,
    val context: Map<String, Any?>? = null
)

data class ChatResponse(
    val answer: String
)

data class RecommendationFilters(
    val goal: String,
    val space: String,
    val light: String,
    val care: String,
    val experience: String,
    val climatePriority: String
)

data class RecommendationLocation(
    val coords: Coords? = null,
    val terrain: String? = null,
    val elevation: Double? = null
)

data class Coords(
    val lat: Double,
    val lon: Double,
    val accuracy: Float? = null
)

data class RecommendationRequest(
    val filters: RecommendationFilters,
    val location: RecommendationLocation? = null,
    val sensors: IoTReading? = null
)

data class RecommendationResponse(
    val summary: String? = null,
    val recommendations: List<PlantRecommendation> = emptyList()
)

data class PlantRecommendation(
    val name: String,
    val category: String? = null,
    val score: Int? = null,
    val reason: String? = null,
    val careTips: List<String> = emptyList(),
    val tags: List<String> = emptyList()
)

data class IoTRequest(
    val userId: Int? = null,
    val plantId: Int? = null,
    val location: RecommendationLocation? = null
)

data class IoTReading(
    val moisture: Int? = null,
    val temp: Int? = null,
    val light: Int? = null,
    val soilPh: Double? = null,
    val humidity: Int? = null,
    val locationPrecisionMeters: Double? = null
)

data class AnalysisRequest(
    val images: List<String>,
    val context: Map<String, Any?>? = null
)

data class AnalysisResponse(
    val summary: String? = null,
    val severity: String? = null,
    val confidence: Double? = null,
    val signs: List<String> = emptyList(),
    val recommendations: List<String> = emptyList(),
    val probableSpecies: List<String> = emptyList()
)

data class AuthRequest(
    val email: String? = null,
    val phone: String? = null,
    val password: String,
    val firstName: String? = null,
    val lastName: String? = null
)

data class UserSession(
    val userId: Int,
    val email: String? = null,
    val phone: String? = null,
    val firstName: String? = null,
    val lastName: String? = null,
    val planStatus: String? = null
)

data class AuthResponse(
    val token: String,
    val user: UserSession
)

data class PurchasePlan(
    val code: String,
    val name: String,
    val price: Double
)

data class PurchaseRequest(
    val userId: Int,
    val plan: PurchasePlan,
    val planCode: String,
    val planName: String,
    val amount: Double,
    val currency: String,
    val paymentMethod: String,
    val email: String,
    val password: String,
    val card: Map<String, String?> = emptyMap()
)

data class PurchaseResponse(
    val user: UserSession? = null,
    val subscription: SubscriptionInfo? = null
)

data class SubscriptionInfo(
    val planCode: String,
    val planName: String,
    val status: String,
    val startDate: String,
    val endDate: String
)

data class ChatMessage(
    val role: String,
    val text: String
)

data class PlannerFormState(
    val goal: String = "ornamental",
    val space: String = "indoor",
    val light: String = "medium",
    val care: String = "medium",
    val experience: String = "beginner",
    val climatePriority: String = "balanced"
)

data class AccountFormState(
    val firstName: String = "",
    val lastName: String = "",
    val email: String = "",
    val phone: String = "",
    val password: String = ""
)

data class EcoStemUiState(
    val planner: PlannerFormState = PlannerFormState(),
    val recommendationsSummary: String = "El recomendador te ayudará a elegir qué sembrar según tu espacio, luz, clima y objetivo.",
    val recommendations: List<PlantRecommendation> = emptyList(),
    val iotReading: IoTReading? = null,
    val iotStatus: String = "Activa tu ubicación para ajustar mejor el monitoreo.",
    val chatMessages: List<ChatMessage> = listOf(
        ChatMessage("assistant", "Hola, soy tu asistente de Eco-STEM. Puedo ayudarte con plantas, clima, riego, plagas y recomendaciones.")
    ),
    val analysis: AnalysisResponse? = null,
    val selectedImageCount: Int = 0,
    val session: UserSession? = null,
    val token: String? = null,
    val activeSubscription: SubscriptionInfo? = null,
    val isLoadingRecommendations: Boolean = false,
    val isLoadingIoT: Boolean = false,
    val isSendingChat: Boolean = false,
    val isAnalyzing: Boolean = false,
    val isAuthenticating: Boolean = false,
    val isPurchasing: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null
)
