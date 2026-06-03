package com.ynba.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.ynba.databinding.ActivityLoginBinding
import com.ynba.models.AuthResponse
import com.ynba.models.LoginRequest
import com.ynba.network.RetrofitClient
import com.ynba.utils.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Assume we use ViewBinding (standard in modern Android)
        // For simplicity in this demo, I'll describe the logic
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)

        // logic for login button click
        // val email = findViewById<EditText>(R.id.etEmail).text.toString()
        // val password = findViewById<EditText>(R.id.etPassword).text.toString()
        // loginUser(email, password)
    }

    private fun loginUser(email: String, password: String) {
        val request = LoginRequest(email, password)

        RetrofitClient.instance.login(request).enqueue(object : Callback<AuthResponse> {
            override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                if (response.isSuccessful && response.body()?.success == true) {
                    val token = response.body()?.token
                    if (token != null) {
                        // PHASE 6: SAVE JWT TOKEN
                        sessionManager.saveAuthToken(token)
                        
                        Toast.makeText(this@LoginActivity, "Login Successful!", Toast.LENGTH_SHORT).show()
                        
                        // Navigate to Dashboard
                        startActivity(Intent(this@LoginActivity, DashboardActivity::class.java))
                        finish()
                    }
                } else {
                    Toast.makeText(this@LoginActivity, "Login Failed: ${response.body()?.message}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                Toast.makeText(this@LoginActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
