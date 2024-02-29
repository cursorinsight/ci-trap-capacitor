# ci-trap-capacitor

Capacitor plugin wrapper over the Android and IOS Trap libraries

## Install

```bash
npm install ci-trap-capacitor
npx cap sync
```

## API

<docgen-index>

* [`addCustomEvent(...)`](#addcustomevent)
* [`addCustomMetadata(...)`](#addcustommetadata)
* [`checkPermission(...)`](#checkpermission)
* [`configure(...)`](#configure)
* [`cleanUp()`](#cleanup)
* [`removeCustomMetadata(...)`](#removecustommetadata)
* [`requestPermission(...)`](#requestpermission)
* [`start()`](#start)
* [`stop()`](#stop)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### addCustomEvent(...)

```typescript
addCustomEvent(options: { event: any; }) => Promise<void>
```

Add custom event

| Param         | Type                         |
| ------------- | ---------------------------- |
| **`options`** | <code>{ event: any; }</code> |

--------------------


### addCustomMetadata(...)

```typescript
addCustomMetadata(options: { key: string; value: any; }) => Promise<void>
```

Add custom metadata

| Param         | Type                                      |
| ------------- | ----------------------------------------- |
| **`options`** | <code>{ key: string; value: any; }</code> |

--------------------


### checkPermission(...)

```typescript
checkPermission(options: { collector: CollectorTypes; }) => Promise<PermissionResult>
```

Checks permission for the specific collector. Returns true if the collector
has the required permission.

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code>{ collector: <a href="#collectortypes">CollectorTypes</a>; }</code> |

**Returns:** <code>Promise&lt;<a href="#permissionresult">PermissionResult</a>&gt;</code>

--------------------


### configure(...)

```typescript
configure(options: { config: TrapConfigurationType; }) => Promise<void>
```

Initialize the plugin

| Param         | Type                                                                                 |
| ------------- | ------------------------------------------------------------------------------------ |
| **`options`** | <code>{ config: <a href="#trapconfigurationtype">TrapConfigurationType</a>; }</code> |

--------------------


### cleanUp()

```typescript
cleanUp() => Promise<void>
```

Cleans up the plugin

--------------------


### removeCustomMetadata(...)

```typescript
removeCustomMetadata(options: { key: string; }) => Promise<void>
```

Remove custom metadata

| Param         | Type                          |
| ------------- | ----------------------------- |
| **`options`** | <code>{ key: string; }</code> |

--------------------


### requestPermission(...)

```typescript
requestPermission(options: { collector: CollectorTypes; }) => Promise<void>
```

Request permission for the specific collector.

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code>{ collector: <a href="#collectortypes">CollectorTypes</a>; }</code> |

--------------------


### start()

```typescript
start() => Promise<void>
```

Start data collection

--------------------


### stop()

```typescript
stop() => Promise<void>
```

Stop data collection

--------------------


### Interfaces


#### PermissionResult

| Prop         | Type                 |
| ------------ | -------------------- |
| **`result`** | <code>boolean</code> |


#### TrapConfigurationType

| Prop                           | Type                                                                                        | Description                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **`defaultDataCollection`**    | <code><a href="#datacollectionconfigurationtype">DataCollectionConfigurationType</a></code> | Default data collection options.                                                                      |
| **`lowBatteryDataCollection`** | <code><a href="#datacollectionconfigurationtype">DataCollectionConfigurationType</a></code> | Limited data collection in case of low battery                                                        |
| **`lowDataDataCollection`**    | <code><a href="#datacollectionconfigurationtype">DataCollectionConfigurationType</a></code> | Limited data collection in case of low battery                                                        |
| **`lowBatteryThreshold`**      | <code>number</code>                                                                         | Battery charge threshold for low battery status                                                       |
| **`queueSize`**                | <code>number</code>                                                                         | The size of the circular data queue.                                                                  |
| **`reporter`**                 | <code><a href="#reporterconfigurationtype">ReporterConfigurationType</a></code>             | The configuration for the reporter task.                                                              |
| **`sessionIdFilter`**          | <code>string</code>                                                                         | SessionId filter, if specified the data collection is only enabled if sessionId &lt;= sessionIdFilter |


#### DataCollectionConfigurationType

| Prop                                  | Type                          | Description                                                                       |
| ------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| **`accelerationMaxReportLatencyMs`**  | <code>number</code>           | How long the sensor can cache reported events.                                    |
| **`accelerationSamplingPeriodMs`**    | <code>number</code>           | How frequent the sampling of the given sensor should be.                          |
| **`collectCoalescedPointerEvents`**   | <code>boolean</code>          | Collect coalesced pointer events                                                  |
| **`collectCoalescedStylusEvents`**    | <code>boolean</code>          | Collect coalesced stylus events                                                   |
| **`collectCoalescedTouchEvents`**     | <code>boolean</code>          | Collect coalesced touch events                                                    |
| **`collectors`**                      | <code>CollectorTypes[]</code> | The list of collectors to start at initialization.                                |
| **`gravityMaxReportLatencyMs`**       | <code>number</code>           | How long the sensor can cache reported events.                                    |
| **`gravitySamplingPeriodMs`**         | <code>number</code>           | How frequent the sampling of the given sensor should be.                          |
| **`gyroscopeMaxReportLatencyMs`**     | <code>number</code>           | How long the sensor can cache reported events.                                    |
| **`gyroscopeSamplingPeriodMs`**       | <code>number</code>           | How frequent the sampling of the given sensor should be.                          |
| **`magnetometerMaxReportLatencyMs`**  | <code>number</code>           | How long the sensor can cache reported events.                                    |
| **`magnetometerSamplingPeriodMs`**    | <code>number</code>           | How frequent the sampling of the given sensor should be.                          |
| **`maxNumberOfLogMessagesPerMinute`** | <code>number</code>           | Maximum number of log messages per collector if the collector uses log throttling |
| **`metadataSubmissionInterval`**      | <code>number</code>           | The time interval metadata events are reported.                                   |
| **`useGestureRecognizer`**            | <code>boolean</code>          | Use gesture recognizer for touch event collection                                 |


#### ReporterConfigurationType

| Prop                   | Type                 | Description                                                                                                                                                                                  |
| ---------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`apiKeyName`**       | <code>string</code>  | Name of the api key sent in the HTTP header                                                                                                                                                  |
| **`apiKeyValue`**      | <code>string</code>  | Value of the api key sent in the HTTP header                                                                                                                                                 |
| **`cachedTransport`**  | <code>boolean</code> | Whether to cache data packets on the device when connection to the remote server cannot be established.                                                                                      |
| **`compress`**         | <code>boolean</code> | Whether to compress the data sent to the server. If true GZIP compression is used.                                                                                                           |
| **`connectTimeout`**   | <code>number</code>  | The connect timeout for the HTTP transport in milliseconds.                                                                                                                                  |
| **`interval`**         | <code>number</code>  | The time interval the reporter task runs with.                                                                                                                                               |
| **`maxFileCacheSize`** | <code>number</code>  | About how much space on the device can be used to store unsent data packets. The lib might use a little more space than this value in case the data packet size exceeds the remaining space. |
| **`readTimeout`**      | <code>number</code>  | The read timeout for the HTTP transport in milliseconds.                                                                                                                                     |
| **`sessionId`**        | <code>string</code>  | The persistent session id to send in the header frame. Must be set manually with a custom config class!                                                                                      |
| **`url`**              | <code>string</code>  | The URL to send the data packets to.                                                                                                                                                         |


### Enums


#### CollectorTypes

| Members               | Value                          |
| --------------------- | ------------------------------ |
| **`Accelerometer`**   | <code>'Accelerometer'</code>   |
| **`Battery`**         | <code>'Battery'</code>         |
| **`Bluetooth`**       | <code>'Bluetooth'</code>       |
| **`CoarseLocation`**  | <code>'CoarseLocation'</code>  |
| **`Gravity`**         | <code>'Gravity'</code>         |
| **`Gyroscope`**       | <code>'Gyroscope'</code>       |
| **`Magnetometer`**    | <code>'Magnetometer'</code>    |
| **`Metadata`**        | <code>'Metadata'</code>        |
| **`Pointer`**         | <code>'Pointer'</code>         |
| **`PreciseLocation`** | <code>'PreciseLocation'</code> |
| **`Stylus`**          | <code>'Stylus'</code>          |
| **`Touch`**           | <code>'Touch'</code>           |
| **`WiFi`**            | <code>'WiFi'</code>            |

</docgen-api>
