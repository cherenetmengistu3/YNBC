package com.ynba.ui

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ynba.R
import com.ynba.models.SummaryResponse
import com.ynba.network.RetrofitClient
import com.ynba.utils.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        sessionManager = SessionManager(this)
        
        // Load the data from the backend
        loadDashboardData()
    }

    private fun loadDashboardData() {
        // Retrieve the saved JWT token
        val token = sessionManager.fetchAuthToken()
        
        if (token == null) {
            // No token found, user should login
            finish()
            return
        }

        // Add "Bearer " prefix for JWT authentication
        val authHeader = "Bearer $token"

        // PHASE 6: CALL API FROM ANDROID
        RetrofitClient.instance.getSummary(authHeader).enqueue(object : Callback<SummaryResponse> {
            override fun onResponse(call: Call<SummaryResponse>, response: Response<SummaryResponse>) {
                if (response.isSuccessful && response.body()?.success == true) {
                    val data = response.body()?.data
                    
                    // Update UI with data from backend
                    // Example:
                    // findViewById<TextView>(R.id.tvBalance).text = "$${data?.net_balance}"
                    
                    Toast.makeText(this@DashboardActivity, "Dashboard Updated", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@DashboardActivity, "Failed to load data", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<SummaryResponse>, t: Throwable) {
                Toast.makeText(this@DashboardActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
