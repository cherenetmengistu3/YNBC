package com.ynba.models

/**
 * Summary data from the dashboard.
 */
data class SummaryResponse(
    val success: Boolean,
    val data: SummaryData
)

data class SummaryData(
    val total_expenses: Double,
    val total_income: Double,
    val net_balance: Double,
    val monthly_breakdown: List<MonthlyStat>,
    val latest_transactions: List<Transaction>
)

data class MonthlyStat(
    val month: String,
    val total_spent: Double
)

data class Transaction(
    val name: String,
    val amount: Double,
    val date: String,
    val type: String // "INCOME" or "EXPENSE"
)

/**
 * Financial Health data.
 */
data class HealthResponse(
    val success: Boolean,
    val data: HealthData
)

data class HealthData(
    val warning: Boolean,
    val message: String,
    val details: HealthDetails
)

data class HealthDetails(
    val monthly_expenses: Double,
    val monthly_income: Double
)

/**
 * Combined Records data.
 */
data class RecordsResponse(
    val success: Boolean,
    val page: Int,
    val limit: Int,
    val data: List<FinancialRecord>
)

data class FinancialRecord(
    val id: Int,
    val name: String,
    val description: String?,
    val category: String,
    val amount: Double,
    val date: String,
    val type: String
)
