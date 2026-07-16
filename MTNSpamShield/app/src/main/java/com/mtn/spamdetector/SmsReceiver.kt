package com.mtn.spamdetector

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.Telephony
import android.util.Log
import android.widget.Toast
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class SmsReceiver : BroadcastReceiver() {

    // IMPORTANT: 10.0.2.2 points to your laptop's localhost from inside the Android Emulator
    private val predictUrl = "http://10.0.2.2:8000/predict"
    private val reportUrl = "http://10.0.2.2:8000/report"
    private val client = OkHttpClient()

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)

            for (sms in messages) {
                val sender = sms.displayOriginatingAddress ?: "Unknown"
                val messageBody = sms.messageBody ?: ""

                Log.d("MTN_SPAM", "Received SMS from: $sender - $messageBody")

                // Send SMS to your Python FastAPI for AI analysis
                checkIfSpam(context, sender, messageBody)
            }
        }
    }

    private fun checkIfSpam(context: Context, sender: String, messageBody: String) {
        try {
            val json = JSONObject()
            json.put("text", messageBody)

            val requestBody = json.toString().toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url(predictUrl)
                .post(requestBody)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    Log.e("MTN_SPAM", "Failed to connect to AI server", e)
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        val responseData = response.body?.string()
                        val jsonResponse = JSONObject(responseData ?: "{}")
                        val classification = jsonResponse.getString("classification")
                        val confidence = jsonResponse.getDouble("confidence_score")

                        // If AI says it is SPAM, alert the user AND report to MTN Dashboard!
                        if (classification == "SPAM") {
                            triggerSpamAlert(context, confidence)
                            reportScammerToMTN(sender, messageBody, confidence)

                            // NEW: Send the details to the MainActivity to display on screen!
                            val updateIntent = Intent("UPDATE_SPAM_LOG")
                            updateIntent.setPackage(context.packageName)
                            updateIntent.putExtra("sender", sender)
                            updateIntent.putExtra("message", messageBody)
                            updateIntent.putExtra("confidence", confidence)
                            context.sendBroadcast(updateIntent)
                        }
                    }
                }
            })
        } catch (e: Exception) {
            Log.e("MTN_SPAM", "Error", e)
        }
    }

    private fun triggerSpamAlert(context: Context, confidence: Double) {
        // Vibrate the phone to warn the user
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(1000, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(1000)
        }

        // We use a handler to show a Toast on the main UI thread
        android.os.Handler(android.os.Looper.getMainLooper()).post {
            Toast.makeText(context, "🚨 MTN WARNING: SPAM DETECTED! Confidence: $confidence%", Toast.LENGTH_LONG).show()
        }
    }

    private fun reportScammerToMTN(sender: String, message: String, confidence: Double) {
        try {
            val reportJson = JSONObject()
            reportJson.put("sender", sender)
            reportJson.put("message", message)
            reportJson.put("confidence", confidence)

            val requestBody = reportJson.toString().toRequestBody("application/json".toMediaType())

            // Sending to the /report endpoint on the FastAPI server
            val reportRequest = Request.Builder()
                .url(reportUrl)
                .post(requestBody)
                .build()

            client.newCall(reportRequest).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    Log.e("MTN_SPAM", "Failed to report scammer", e)
                }
                override fun onResponse(call: Call, response: Response) {
                    Log.d("MTN_SPAM", "Scammer successfully reported to MTN Dashboard!")
                }
            })
        } catch (e: Exception) {
            Log.e("MTN_SPAM", "Error reporting scammer", e)
        }
    }
}