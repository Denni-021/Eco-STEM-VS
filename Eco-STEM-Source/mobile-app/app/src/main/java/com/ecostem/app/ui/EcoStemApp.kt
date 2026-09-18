package com.ecostem.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.AutoAwesome
import androidx.compose.material.icons.outlined.Eco
import androidx.compose.material.icons.outlined.Forum
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Memory
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.ecostem.app.ui.screens.AccountScreen
import com.ecostem.app.ui.screens.AnalyzerScreen
import com.ecostem.app.ui.screens.AssistantScreen
import com.ecostem.app.ui.screens.DashboardScreen
import com.ecostem.app.ui.screens.HomeScreen
import com.ecostem.app.ui.screens.PlannerScreen

private data class AppDestination(
    val route: String,
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector
)

@Composable
fun EcoStemApp(viewModel: EcoStemViewModel) {
    val navController = rememberNavController()
    val destinations = listOf(
        AppDestination("home", "Inicio", Icons.Outlined.Home),
        AppDestination("analyzer", "IA", Icons.Outlined.Eco),
        AppDestination("planner", "Recomen", Icons.Outlined.AutoAwesome),
        AppDestination("iot", "Panel", Icons.Outlined.Memory),
        AppDestination("assistant", "Asistente", Icons.Outlined.Forum),
        AppDestination("account", "Cuenta", Icons.Outlined.AccountCircle)
    )

    LaunchedEffect(Unit) {
        viewModel.preloadDemo()
    }

    Scaffold(
        containerColor = Color.Transparent,
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xEE0A1423),
                contentColor = Color.White
            ) {
                val backStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = backStackEntry?.destination?.route
                destinations.forEach { destination ->
                    val selected = currentRoute == destination.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(destination.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(destination.icon, contentDescription = destination.label) },
                        label = { Text(destination.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF07111F),
                            selectedTextColor = Color(0xFFE9FFFB),
                            indicatorColor = Color(0xFF29E3C5),
                            unselectedIconColor = Color(0xFF8FA6C0),
                            unselectedTextColor = Color(0xFF8FA6C0)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF06101D), Color(0xFF0A1A2B), Color(0xFF08111C))
                    )
                )
                .padding(innerPadding)
        ) {
            NavHost(
                navController = navController,
                startDestination = "home"
            ) {
                composable("home") { HomeScreen(viewModel) }
                composable("analyzer") { AnalyzerScreen(viewModel) }
                composable("planner") { PlannerScreen(viewModel) }
                composable("iot") { DashboardScreen(viewModel) }
                composable("assistant") { AssistantScreen(viewModel) }
                composable("account") { AccountScreen(viewModel) }
            }
        }
    }
}
