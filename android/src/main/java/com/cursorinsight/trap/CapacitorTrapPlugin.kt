package com.cursorinsight.trap

import com.cursorinsight.trap.TrapConfig
import com.cursorinsight.trap.TrapManager
import com.cursorinsight.trap.datasource.TrapBluetoothCollector
import com.cursorinsight.trap.datasource.TrapCoarseLocationCollector
import com.cursorinsight.trap.datasource.TrapDatasource
import com.cursorinsight.trap.datasource.TrapMetadataCollector
import com.cursorinsight.trap.datasource.TrapPreciseLocationCollector
import com.cursorinsight.trap.datasource.TrapWiFiCollector
import com.cursorinsight.trap.datasource.gesture.TrapPointerCollector
import com.cursorinsight.trap.datasource.gesture.TrapStylusCollector
import com.cursorinsight.trap.datasource.gesture.TrapTouchCollector
import com.cursorinsight.trap.datasource.hardware.TrapBatteryCollector
import com.cursorinsight.trap.datasource.sensor.TrapAccelerometerCollector
import com.cursorinsight.trap.datasource.sensor.TrapGravityCollector
import com.cursorinsight.trap.datasource.sensor.TrapGyroscopeCollector
import com.cursorinsight.trap.datasource.sensor.TrapMagnetometerCollector
import com.getcapacitor.JSObject
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.util.UUID

@CapacitorPlugin(name = "CapacitorTrap")
class CapacitorTrapPlugin : Plugin() {
    private val TAG = "CapacitorTrapPlugin"

    private var trapManager: TrapManager? = null

    @PluginMethod
    fun addCustomEvent(call: PluginCall) {
        val event = call.data.opt("event")
        if (event == null) {
            call.reject("Required property 'event' is not set")
            return
        }
        invokeFunctionIfManagerIsInitialized(
            call,
            { manager -> manager.addCustomEvent(event)})
    }

    @PluginMethod
    fun addCustomMetadata(call: PluginCall) {
        val key = call.getString("key")
        val value = call.data.opt("value")
        if (key.isNullOrEmpty()) {
            call.reject("Required property 'key' is not set")
            return
        }
        if (value == null) {
            call.reject("Required property 'value' is not set")
            return
        }
        invokeFunctionIfManagerIsInitialized(
            call,
            { manager -> manager.addCustomMetadata(key, value)})
    }

    @PluginMethod
    fun checkPermission(call: PluginCall) {
        val collector = call.getString("collector")
        if (collector.isNullOrEmpty()) {
            call.reject("Required property 'collector' is not set")
            return
        }

        val result = when (collector) {
            "Accelerometer",
            "Battery",
            "Gravity",
            "Gyroscope",
            "Magnetometer",
            "Metadata",
            "Pointer",
            "Stylus",
            "Touch" -> true
            "Bluetooth" -> TrapBluetoothCollector.checkPermissions(getBridge().activity)
            "CoarseLocation" -> TrapCoarseLocationCollector.checkPermissions(getBridge().activity)
            "PreciseLocation" -> TrapPreciseLocationCollector.checkPermissions(getBridge().activity)
            "WiFi" -> TrapWiFiCollector.checkPermissions(getBridge().activity)
            else -> {
                call.reject("Not supported collector ${collector}")
                return
            }
        }
        call.resolve(with(JSObject()) {
            put("result", result)
        })
    }

    @PluginMethod
    fun cleanUp(call: PluginCall) {
        val manager = trapManager
        if (manager != null) {
            manager.disableDataCollection()
        }
        trapManager = null
        call.resolve()
    }

    @PluginMethod
    fun configure(call: PluginCall) {
        val config = createConfigFromJson(call.getObject("config"))
        config.enableDataCollection = false
        trapManager = TrapManager.getInstance(
            getBridge().activity.application,
            config,
            getBridge().activity
        )
        call.resolve()
    }

    @PluginMethod
    fun removeCustomMetadata(call: PluginCall) {
        val key = call.getString("key")
        if (key.isNullOrEmpty()) {
            call.reject("Required property 'key' is not set")
            return
        }
        invokeFunctionIfManagerIsInitialized(
            call,
            { manager -> manager.removeCustomMetadata(key)})
    }

    @PluginMethod
    fun requestPermission(call: PluginCall) {
        val collector = call.getString("collector")
        if (collector.isNullOrEmpty()) {
            call.reject("Required property 'collector' is not set")
            return
        }

        when (collector) {
            "Accelerometer",
            "Battery",
            "Gravity",
            "Gyroscope",
            "Magnetometer",
            "Metadata",
            "Pointer",
            "Stylus",
            "Touch" -> call.resolve()
            "Bluetooth" -> TrapBluetoothCollector.requirePermissions(
                getBridge().activity
            ) {
                call.resolve()
            }
            "CoarseLocation" -> TrapCoarseLocationCollector.requirePermissions(
                getBridge().activity
            ) {
                call.resolve()
            }
            "PreciseLocation" -> TrapPreciseLocationCollector.requirePermissions(
                getBridge().activity
            ) {
                call.resolve()
            }
            "WiFi" -> TrapWiFiCollector.requirePermissions(
                getBridge().activity
            ) {
                call.resolve()
            }
            else -> {
                call.reject("Not supported collector ${collector}")
            }
        }
    }

    @PluginMethod
    fun start(call: PluginCall) {
        invokeFunctionIfManagerIsInitialized(
            call,
            { manager -> manager.enableDataCollection() })
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        invokeFunctionIfManagerIsInitialized(
            call,
            { manager -> manager.disableDataCollection() });
    }

    private fun invokeFunctionIfManagerIsInitialized(
        call: PluginCall,
        function: (TrapManager) -> Unit)
    {
        val manager = trapManager
        if (manager != null) {
            function(manager)
            call.resolve()
        }
        else {
            call.reject("Plugin is not configured. Call configure first")
        }
    }

    private fun createConfigFromJson(data: JSObject): TrapConfig {
        val config = TrapConfig()

        config.sessionIdFilter =
            data.getString("sessionIdFilter") ?: config.sessionIdFilter
        config.queueSize =
            data.getInteger("queueSize") ?: config.queueSize
        try {
            config.lowBatteryThreshold =
                data.getDouble("lowBatteryThreshold") as Float
        } catch (e : Exception) {
            Logger.error(TAG, e);
        }

        val reporterJSON = data.getJSObject("reporter")
        if (reporterJSON != null) {
            convertReporter(config.reporter, reporterJSON)
        }
        val defaultDataCollectionJSON =
            data.getJSObject("defaultDataCollection")
        if (defaultDataCollectionJSON != null) {
            convertDataCollection(
                config.defaultDataCollection,
                defaultDataCollectionJSON)
        }
        val lowBatteryDataCollectionJSON =
            data.getJSObject("lowBatteryDataCollection")
        if (lowBatteryDataCollectionJSON != null) {
            convertDataCollection(
                config.lowBatteryDataCollection,
                lowBatteryDataCollectionJSON)
        }
        val lowDataDataCollectionJSON =
            data.getJSObject("lowDataDataCollection")
        if (lowDataDataCollectionJSON != null) {
            convertDataCollection(
                config.lowDataDataCollection,
                lowDataDataCollectionJSON)
        }
        return config
    }

    private fun getDataSource(collectorName: String): TrapDatasource {
        return when (collectorName) {
            "Accelerometer" -> TrapAccelerometerCollector()
            "Battery" -> TrapBatteryCollector()
            "Bluetooth" -> TrapBluetoothCollector()
            "Gravity" -> TrapGravityCollector()
            "Gyroscope" -> TrapGyroscopeCollector()
            "CoarseLocation" -> TrapCoarseLocationCollector()
            "PreciseLocation" -> TrapPreciseLocationCollector()
            "Magnetometer" -> TrapMagnetometerCollector()
            "Metadata" -> TrapMetadataCollector()
            "Pointer" -> TrapPointerCollector()
            "Stylus" -> TrapStylusCollector()
            "Touch" -> TrapTouchCollector()
            "WiFi" -> TrapWiFiCollector()
            else -> {
                throw Exception("Not supported collector ${collectorName}")
            }
        }
    }

    private fun convertDataCollection(
        dataCollection: TrapConfig.DataCollection,
        dataCollectionJSON: JSObject) {
        dataCollection.collectCoalescedPointerEvents =
            dataCollectionJSON.getBool("collectCoalescedPointerEvents") ?:
            dataCollection.collectCoalescedPointerEvents
        dataCollection.collectCoalescedStylusEvents =
            dataCollectionJSON.getBool("collectCoalescedStylusEvents") ?:
            dataCollection.collectCoalescedStylusEvents
        dataCollection.collectCoalescedPointerEvents =
            dataCollectionJSON.getBool("collectCoalescedPointerEvents") ?:
            dataCollection.collectCoalescedPointerEvents
        dataCollection.accelerationMaxReportLatencyMs =
            dataCollectionJSON.getInteger("accelerationMaxReportLatencyMs") ?:
            dataCollection.accelerationMaxReportLatencyMs
        dataCollection.accelerationSamplingPeriodMs
            dataCollectionJSON.getInteger("accelerationSamplingPeriodMs") ?:
            dataCollection.accelerationSamplingPeriodMs
        dataCollection.gravityMaxReportLatencyMs
            dataCollectionJSON.getInteger("gravityMaxReportLatencyMs") ?:
            dataCollection.gravityMaxReportLatencyMs
        dataCollection.gravitySamplingPeriodMs
            dataCollectionJSON.getInteger("gravitySamplingPeriodMs") ?:
            dataCollection.gravitySamplingPeriodMs
        dataCollection.gyroscopeMaxReportLatencyMs
            dataCollectionJSON.getInteger("gyroscopeMaxReportLatencyMs") ?:
            dataCollection.gyroscopeMaxReportLatencyMs
        dataCollection.gyroscopeSamplingPeriodMs
            dataCollectionJSON.getInteger("gyroscopeSamplingPeriodMs") ?:
            dataCollection.gyroscopeSamplingPeriodMs
        dataCollection.magnetometerMaxReportLatencyMs
            dataCollectionJSON.getInteger("magnetometerMaxReportLatencyMs") ?:
            dataCollection.magnetometerMaxReportLatencyMs
        dataCollection.magnetometerSamplingPeriodMs
            dataCollectionJSON.getInteger("magnetometerSamplingPeriodMs") ?:
            dataCollection.magnetometerSamplingPeriodMs
        dataCollection.maxNumberOfLogMessagesPerMinute
            dataCollectionJSON.getInteger("maxNumberOfLogMessagesPerMinute") ?:
            dataCollection.maxNumberOfLogMessagesPerMinute
        dataCollection.metadataSubmissionInterval
            dataCollectionJSON.getInteger("metadataSubmissionInterval") ?:
            dataCollection.metadataSubmissionInterval

        val collectorArray = dataCollectionJSON.getJSONArray("collectors")
        if (collectorArray != null) {
            var collectors = mutableListOf<TrapDatasource>()
            for (i in 0 until collectorArray.length()) {
                val collectorName = collectorArray.getString(i)
                if (collectorName != null) {
                    collectors.add(getDataSource(collectorName))
                }
            }
            dataCollection.collectors = collectors
        }
    }

    private fun convertReporter(
        reporter: TrapConfig.Reporter,
        reporterJSON: JSObject
    ) {
        reporter.apiKeyName =
            reporterJSON.getString("apiKeyName") ?: reporter.apiKeyName
        reporter.apiKeyValue =
            reporterJSON.getString("apiKeyValue") ?: reporter.apiKeyValue
        reporter.cachedTransport =
            reporterJSON.getBool("cachedTransport") ?: reporter.cachedTransport
        reporter.compress =
            reporterJSON.getBool("compress") ?: reporter.compress
        reporter.connectTimeout =
            reporterJSON.getInteger("connectTimeout") ?: reporter.connectTimeout
        try {
            reporter.interval = reporterJSON.getLong("interval")
        } catch (e: Exception) {
            Logger.error(TAG, e);
        }
        try {
            reporter.maxFileCacheSize =
                reporterJSON.getLong("maxFileCacheSize")
        } catch (e: Exception) {
            Logger.error(TAG, e);
        }
        reporter.readTimeout =
            reporterJSON.getInteger("readTimeout") ?: reporter.readTimeout
        reporter.sessionId = UUID.fromString(
            reporterJSON.getString("sessionId") ?: reporter.sessionId.toString()
        )
        reporter.url = reporterJSON.getString("url") ?: reporter.url
    }
}
