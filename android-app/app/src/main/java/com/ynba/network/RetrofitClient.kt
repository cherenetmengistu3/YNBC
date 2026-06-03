package com.ynba.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

/**
 * Singleton object to manage the Retrofit instance.
 */
object RetrofitClient {
    // 10.0.2.2 is the special IP to access your machine's localhost from the Android Emulator
    private const val BASE_URL = "http://10.0.2.2:3000/"

    private val logger = HttpLoggingInterceptor().apply { 
        level = HttpLoggingInterceptor.Level.BODY 
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(logger)
        .build()

    val instance: ApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        
        retrofit.create(ApiService::class.java)
    }
}
