package com.mtn.spamdetector

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    private val smsPermissionCode = 101
    private lateinit var threatLogContainer: LinearLayout
    private lateinit var emptyLogText: TextView

    // Tab Views
    private lateinit var tabHome: LinearLayout
    private lateinit var tabLogs: LinearLayout
    private lateinit var navHome: TextView
    private lateinit var navLogs: TextView

    private val uiUpdateReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == "UPDATE_SPAM_LOG") {
                val sender = intent.getStringExtra("sender") ?: "Unknown"
                val message = intent.getStringExtra("message") ?: ""
                val confidence = intent.getDoubleExtra("confidence", 0.0)

                addThreatToLog(sender, message, confidence)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize Views
        threatLogContainer = findViewById(R.id.threatLogContainer)
        emptyLogText = findViewById(R.id.emptyLogText)
        tabHome = findViewById(R.id.tabHome)
        tabLogs = findViewById(R.id.tabLogs)
        navHome = findViewById(R.id.navHome)
        navLogs = findViewById(R.id.navLogs)

        setupTabNavigation()
        loadThreatsFromStorage()

        // Request Permissions
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECEIVE_SMS) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this, arrayOf(Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS), smsPermissionCode
            )
        }

        // Register secure broadcast receiver
        val filter = IntentFilter("UPDATE_SPAM_LOG")
        ContextCompat.registerReceiver(
            this,
            uiUpdateReceiver,
            filter,
            ContextCompat.RECEIVER_NOT_EXPORTED
        )
    }

    private fun setupTabNavigation() {
        navHome.setOnClickListener {
            tabHome.visibility = View.VISIBLE
            tabLogs.visibility = View.GONE
            navHome.setTextColor(Color.parseColor("#ffcc00"))
            navLogs.setTextColor(Color.parseColor("#9a927a"))
        }

        navLogs.setOnClickListener {
            tabHome.visibility = View.GONE
            tabLogs.visibility = View.VISIBLE
            navHome.setTextColor(Color.parseColor("#9a927a"))
            navLogs.setTextColor(Color.parseColor("#ffcc00"))
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(uiUpdateReceiver)
    }

    private fun loadThreatsFromStorage() {
        val prefs = getSharedPreferences("MTN_SPAM_PREFS", Context.MODE_PRIVATE)
        val existingLogsStr = prefs.getString("SPAM_LOGS", "[]")
        val logsArray = JSONArray(existingLogsStr)

        if (logsArray.length() > 0) {
            emptyLogText.visibility = View.GONE
            for (i in logsArray.length() - 1 downTo 0) {
                val log = logsArray.getJSONObject(i)
                drawThreatCard(log.getString("sender"), log.getString("message"), log.getDouble("confidence"))
            }
        }
    }

    private fun saveThreatToStorage(sender: String, message: String, confidence: Double) {
        val prefs = getSharedPreferences("MTN_SPAM_PREFS", Context.MODE_PRIVATE)
        val existingLogsStr = prefs.getString("SPAM_LOGS", "[]")
        val logsArray = JSONArray(existingLogsStr)

        val newLog = JSONObject().apply {
            put("sender", sender)
            put("message", message)
            put("confidence", confidence)
        }

        val updatedArray = JSONArray()
        updatedArray.put(newLog)
        for (i in 0 until logsArray.length()) {
            updatedArray.put(logsArray.getJSONObject(i))
        }

        prefs.edit().putString("SPAM_LOGS", updatedArray.toString()).apply()
    }

    private fun addThreatToLog(sender: String, message: String, confidence: Double) {
        saveThreatToStorage(sender, message, confidence)
        drawThreatCard(sender, message, confidence)
    }

    private fun drawThreatCard(sender: String, message: String, confidence: Double) {
        emptyLogText.visibility = View.GONE

        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#262013"))
            setPadding(40, 40, 40, 40)

            val params = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            params.setMargins(0, 0, 0, 30)
            layoutParams = params
            elevation = 4f
        }

        val header = TextView(this).apply {
            text = "🚨 BLOCKED: $sender"
            setTextColor(Color.parseColor("#ff5a3c"))
            textSize = 16f
            setTypeface(null, android.graphics.Typeface.BOLD)
        }

        val body = TextView(this).apply {
            text = "\"$message\""
            setTextColor(Color.parseColor("#f4efdf"))
            textSize = 15f
            setPadding(0, 15, 0, 15)
        }

        val reason = TextView(this).apply {
            text = "Confidence: $confidence% (Fraud match)"
            setTextColor(Color.parseColor("#ffcc00"))
            textSize = 12f
        }

        card.addView(header)
        card.addView(body)
        card.addView(reason)

        threatLogContainer.addView(card, 0)
    }
}