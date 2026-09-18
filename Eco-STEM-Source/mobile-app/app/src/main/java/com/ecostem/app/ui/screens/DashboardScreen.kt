package com.ecostem.app.ui.screens

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.core.content.ContextCompat
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.components.GradientButton
import com.ecostem.app.ui.components.MetricStrip
import com.ecostem.app.ui.components.ScreenContainer
import com.ecostem.app.ui.components.SectionCard
import com.google.android.gms.location.LocationServices

@Composable
fun DashboardScreen(viewModel: EcoStemViewModel) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
            permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        if (granted) {
            requestLocation(context, viewModel)
        } else {
            viewModel.clearMessages()
        }
    }

    ScreenContainer(
        eyebrow = "Sensores IoT en tiempo real",
        title = "Panel de monitoreo inteligente",
        subtitle = "Activa tu ubicacion exacta para ajustar humedad, temperatura, luz y terreno con mas precision."
    ) {
        GradientButton(
            text = if (state.isLoadingIoT) "Activando ubicacion..." else "Activar ubicacion exacta",
            enabled = !state.isLoadingIoT
        ) {
            val fine = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
            val coarse = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
            if (fine || coarse) {
                requestLocation(context, viewModel)
            } else {
                permissionLauncher.launch(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION))
            }
        }
        if (state.isLoadingIoT) {
            CircularProgressIndicator(color = Color(0xFF46F6CB))
        }
        MetricStrip("Humedad del suelo", "${state.iotReading?.moisture ?: "--"}%")
        MetricStrip("Temperatura", "${state.iotReading?.temp ?: "--"} C")
        MetricStrip("Nivel de luz", "${state.iotReading?.light ?: "--"}%")
        MetricStrip("Humedad ambiente", "${state.iotReading?.humidity ?: "--"}%")
        MetricStrip("pH del suelo", "${state.iotReading?.soilPh ?: "--"}")
        MetricStrip("Precision GPS", "${state.iotReading?.locationPrecisionMeters ?: "--"} m")

        SectionCard("Estado del entorno") {
            Text(state.iotStatus, color = Color(0xFFD7E6F5))
            Text("Si el sensor cambia con tu zona real, las recomendaciones seran mucho mas utiles.", color = Color(0xFF7CF1E0), fontWeight = FontWeight.SemiBold)
        }
    }
}

@SuppressLint("MissingPermission")
private fun requestLocation(context: android.content.Context, viewModel: EcoStemViewModel) {
    val client = LocationServices.getFusedLocationProviderClient(context)
    client.lastLocation.addOnSuccessListener { location ->
        if (location != null) {
            viewModel.updateLocationAndLoadIoT(location.latitude, location.longitude, location.accuracy)
        }
    }.addOnFailureListener {
        viewModel.clearMessages()
    }
}
