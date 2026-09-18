package com.ecostem.app.network

import com.ecostem.app.data.AnalysisRequest
import com.ecostem.app.data.AnalysisResponse
import com.ecostem.app.data.AuthRequest
import com.ecostem.app.data.AuthResponse
import com.ecostem.app.data.ChatRequest
import com.ecostem.app.data.ChatResponse
import com.ecostem.app.data.IoTRequest
import com.ecostem.app.data.IoTReading
import com.ecostem.app.data.PurchaseRequest
import com.ecostem.app.data.PurchaseResponse
import com.ecostem.app.data.RecommendationRequest
import com.ecostem.app.data.RecommendationResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface EcoStemApi {
    @POST("chat")
    suspend fun sendChat(@Body request: ChatRequest): ChatResponse

    @POST("recommendations")
    suspend fun getRecommendations(@Body request: RecommendationRequest): RecommendationResponse

    @POST("iot")
    suspend fun simulateIoT(@Body request: IoTRequest): IoTReading

    @POST("analysis/vision")
    suspend fun analyzePlant(@Body request: AnalysisRequest): AnalysisResponse

    @POST("auth/register")
    suspend fun register(@Body request: AuthRequest): AuthResponse

    @POST("auth/login")
    suspend fun login(@Body request: AuthRequest): AuthResponse

    @POST("subscriptions/purchase")
    suspend fun purchase(@Body request: PurchaseRequest): PurchaseResponse
}
