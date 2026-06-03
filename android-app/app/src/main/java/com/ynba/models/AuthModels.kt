package com.ynba.models

/**
 * Data model for the Login Request body.
 */
data class LoginRequest(
    val email: String,
    val password: String
)

/**
 * Data model for the Authentication Response from the backend.
 */
data class AuthResponse(
    val success: Boolean,
    val message: String,
    val token: String? = null
)
