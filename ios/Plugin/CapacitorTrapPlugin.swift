import Foundation
import Capacitor
import Trap

struct ParameterError : Error {
    let description: String

    init(_ description: String) {
        self.description = description
    }
}

@objc(CapacitorTrapPlugin)
class CapacitorTrapPlugin : CAPPlugin {
    private var trapManager : TrapManager? = nil

    private let queue = OperationQueue()

    @objc func addCustomEvent(_ call: CAPPluginCall) {
        guard let event = call.getValue("event") else {
            call.reject("Required property 'event' is not set")
            return
        }
        invokeFunctionIfManagerIsInitialized(call, { manager in
            manager.addCustomEvent(custom: convertJsObject(event))
            call.resolve()
        })
    }

    @objc func addCustomMetadata(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), !key.isEmpty else {
            call.reject("Required property 'key' is not set")
            return
        }
        guard let value = call.getValue("value") else {
            call.reject("Required property 'value' is not set")
            return
        }
        invokeFunctionIfManagerIsInitialized(call, { manager in
            manager.addCustomMetadata(key: key, value: convertJsObject(value))
            call.resolve()
        })
    }

    @objc func checkPermission(_ call: CAPPluginCall) {
        guard let collector = call.getString("collector"),
            !collector.isEmpty else {
            call.reject("Required property 'collector' is not set")
            return
        }
        do {
            let dataSource = try getDataSource(collector)
                .instance(withQueue: queue)
            let result = dataSource.checkPermission()
            call.resolve(["result": result])
        } catch {
            call.reject("\(error)")
        }
    }

    @objc func cleanUp(_ call: CAPPluginCall) {
        if let manager = trapManager {
            manager.haltAll()
        }
        trapManager = nil
        call.resolve()
    }

    @objc func configure(_ call: CAPPluginCall) {
        guard let value = call.getObject("config") else {
            call.reject("Required property 'config' is not set")
            return
        }
        let config = createConfigFromJson(value)
        trapManager = TrapManager(withConfig: config)
        call.resolve()
    }

    @objc func removeCustomMetadata(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), !key.isEmpty else {
            call.reject("Required property 'key' is not set")
            return
        }
        invokeFunctionIfManagerIsInitialized(call, { manager in
            manager.removeCustomMetadata(key: key)
            call.resolve()
        })
    }

    @objc func requestPermission(_ call: CAPPluginCall) {
        guard let collector = call.getString("collector"),
            !collector.isEmpty else {
            call.reject("Required property 'collector' is not set")
            return
        }
        do {
            let dataSource = try getDataSource(collector)
                .instance(withQueue: queue)
            dataSource.requestPermission {
                call.resolve()
            }
        } catch {
            call.reject("\(error)")
        }
    }

    @objc func start(_ call: CAPPluginCall) {
        invokeFunctionIfManagerIsInitialized(call, { manager in
            do {
                try manager.runAll()
                call.resolve()
            } catch {
                call.reject("Could not start")
            }
        })
    }

    @objc func stop(_ call: CAPPluginCall) {
        invokeFunctionIfManagerIsInitialized(call, { manager in
            manager.haltAll()
            call.resolve()
        })
    }

    private func getDataSource(_ collector: String) throws ->
        TrapDatasource.Type
    {
        switch (collector) {
            case "Accelerometer":
                return TrapAccelerometerCollector.self
            case "Gravity":
                return TrapGravityCollector.self
            case "Gyroscope":
                return TrapGyroscopeCollector.self
            case "CoarseLocation":
                return  TrapLocationCollector.self
            case "PreciseLocation":
                return TrapPreciseLocationCollector.self
            case "Magnetometer":
                return TrapMagnetometerCollector.self
            case "Stylus":
                return TrapStylusCollector.self
            case "Touch":
                return TrapTouchCollector.self
            case "WiFi":
                return TrapWiFiCollector.self
            case "Battery":
                return TrapBatteryCollector.self
            case "Metadata":
                return TrapMetadataCollector.self
            default:
                if #available(iOS 13.1, *), collector == "Bluetooth" {
                    return TrapBluetoothCollector.self
                }
                if #available(iOS 13.4, *), collector == "Pointer" {
                    return TrapPointerCollector.self
                }
            throw ParameterError("Uknown datasource type: \(collector)")
        }
    }

    private func convertJsObject(_ value: JSValue) -> DataType {
        if let typedValue = value as? String {
            return DataType.string(typedValue)
        }
        if let typedValue = value as? Bool {
            return DataType.bool(typedValue)
        }
        if let typedValue = value as? Int {
            return DataType.int(typedValue)
        }
        if let typedValue = value as? Float {
            return DataType.float(typedValue)
        }
        if let typedValue = value as? Double {
            return DataType.double(typedValue)
        }
        if let typedValue = value as? Array<JSValue> {
            return DataType.array(typedValue.map { convertJsObject($0) })
        }
        if let typedValue = value as? Dictionary<String,JSValue> {
            return DataType.dict(typedValue.mapValues{ convertJsObject($0) })
        }
        return DataType.string(String(describing: value))
    }

    private func invokeFunctionIfManagerIsInitialized(
        _ call: CAPPluginCall,
        _ function: (TrapManager) -> Void)
    {
        guard let manager = trapManager else {
            call.reject("Plugin is not configured. Call configure first")
            return
        }
        function(manager)
        call.resolve()
    }

    private func createConfigFromJson(_ jsConfig: [AnyHashable : Any])
        -> TrapConfig
    {
        var config = TrapConfig()
        config.queueSize = jsConfig["queueSize"] as? Int ?? config.queueSize
            config.sessionIdFilter =
            jsConfig["sessionIdFilter"] as? String ?? config.sessionIdFilter
        config.lowBatteryThreshold =
            jsConfig["lowBatteryThreshold"] as? Float ??
            config.lowBatteryThreshold

        if let jsReporter =
            jsConfig["reporter"] as? Dictionary<String,JSValue>
        {
            convertReporter(&config.reporter, jsReporter)
        }

        if let jsDefaultDataCollection =
            jsConfig["defaultDataCollection"] as? Dictionary<String,JSValue>
        {
                convertDataCollection(
                    &config.defaultDataCollection,
                    jsDefaultDataCollection)
        }
        if let jsLowBatteryDataCollection =
            jsConfig["lowBatteryDataCollection"] as? Dictionary<String,JSValue>
        {
            convertDataCollection(
                &config.lowBatteryDataCollection,
                jsLowBatteryDataCollection)
        }
        if let jsLowDataDataCollection
             = jsConfig["lowDataDataCollection"] as? Dictionary<String,JSValue>
        {
            convertDataCollection(
                &config.lowDataDataCollection,
                jsLowDataDataCollection)
        }
        return config
    }

    private func convertDataCollection(
        _ dataCollection: inout TrapConfig.DataCollection,
        _ jsDataCollection: JSObject)
    {
        dataCollection.collectCoalescedPointerEvents =
            jsDataCollection["collectCoalescedPointerEvents"] as? Bool ??
            dataCollection.collectCoalescedPointerEvents
        dataCollection.collectCoalescedStylusEvents =
            jsDataCollection["collectCoalescedStylusEvents"] as? Bool ??
            dataCollection.collectCoalescedStylusEvents
        dataCollection.collectCoalescedPointerEvents =
            jsDataCollection["collectCoalescedPointerEvents"] as? Bool ??
            dataCollection.collectCoalescedPointerEvents
        dataCollection.useGestureRecognizer =
            jsDataCollection["useGestureRecognizer"] as? Bool ??
            dataCollection.useGestureRecognizer

        if let periodMs =
            jsDataCollection["accelerationSamplingPeriodMs"] as? Int
        {
            dataCollection.accelerationSamplingRate = Double(periodMs) / 1000
        }
        if let periodMs = jsDataCollection["gravitySamplingPeriodMs"] as? Int {
            dataCollection.gravitySamplingRate = Double(periodMs) / 1000
        }
        if let periodMs =
            jsDataCollection["gyroscopeSamplingPeriodMs"] as? Int
        {
            dataCollection.gyroscopeSamplingRate = Double(periodMs) / 1000
        }
        if let periodMs =
            jsDataCollection["magnetometerSamplingPeriodMs"] as? Int
        {
            dataCollection.magnetometerSamplingRate = Double(periodMs) / 1000
        }

        if let intervalMs =
            jsDataCollection["metadataSubmissionInterval"] as? Int
        {
            dataCollection.metadataSubmissionInterval =
                Double(intervalMs) / 1000
        }

        if let collectorArray =
            jsDataCollection["collectors"] as? Array<String>
        {
            dataCollection.collectors = collectorArray
                .map {
                    do {
                        return String(describing: try getDataSource($0))
                    } catch {
                        CAPLog.print(error)
                        return String()
                    }
                }
        }
    }

    private func convertReporter(
        _ reporter: inout TrapConfig.Reporter,
        _ jsReporter: Dictionary<String,JSValue>
    ) {
        reporter.apiKeyName =
            jsReporter["apiKeyName"] as? String ?? reporter.apiKeyName
        reporter.apiKeyValue =
            jsReporter["apiKeyValue"] as? String ?? reporter.apiKeyValue
        reporter.cachedTransport =
            jsReporter["cachedTransport"] as? Bool ?? reporter.cachedTransport
        reporter.compressed =
            jsReporter["compress"] as? Bool ?? reporter.compressed

        if let interval = jsReporter["interval"] as? Int {
            reporter.interval = .milliseconds(interval)
        }
        if let maxFileCacheSizeInt = jsReporter["maxFileCacheSize"] as? Int {
            reporter.maxFileCacheSize = UInt64(maxFileCacheSizeInt)
        }
        if let sessionIdString = jsReporter["sessionId"] as? String,
           let sessionIdUUID = UUID(uuidString: sessionIdString) {
                reporter.sessionId = sessionIdUUID
        }
        reporter.url = jsReporter["url"] as? String ?? reporter.url
    }
}
