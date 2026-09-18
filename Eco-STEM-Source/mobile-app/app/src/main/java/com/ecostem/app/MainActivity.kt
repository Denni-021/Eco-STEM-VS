package com.ecostem.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ecostem.app.ui.EcoStemApp
import com.ecostem.app.ui.EcoStemViewModel
import com.ecostem.app.ui.theme.EcoStemTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EcoStemTheme {
                val viewModel: EcoStemViewModel = viewModel()
                EcoStemApp(viewModel = viewModel)
            }
        }
    }
}
