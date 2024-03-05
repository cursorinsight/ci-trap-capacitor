import { v4 as uuidv4 } from 'uuid';

import type { TrapConfigurationType } from './definitions';
import { CollectorTypes } from './definitions';

const reporterConfig = {
  apiKeyName: "graboxy-api-key",

  apiKeyValue: "api-key-value",

  cachedTransport: true,

  compress: false,

  connectTimeout: 500,

  interval: 1000,

  maxFileCacheSize: 5_000_000,

  url: "https://trap.graboxy.com/api/1/submit/{sessionId}/{streamId}",

  readTimeout: 500,

  sessionId: uuidv4(),
};

const defaultCollector = {
  accelerationMaxReportLatencyMs: 200,

  accelerationSamplingPeriodMs: 10,

  collectCoalescedPointerEvents: true,

  collectCoalescedStylusEvents: true,

  collectCoalescedTouchEvents: true,

  collectors: Array<CollectorTypes>(
    CollectorTypes.Accelerometer,
    CollectorTypes.Battery,
    CollectorTypes.Bluetooth,
    CollectorTypes.CoarseLocation,
    CollectorTypes.Gravity,
    CollectorTypes.Gyroscope,
    CollectorTypes.Magnetometer,
    CollectorTypes.Metadata,
    CollectorTypes.Pointer,
    CollectorTypes.Stylus,
    CollectorTypes.Touch,
    CollectorTypes.WiFi,
  ),

  gravityMaxReportLatencyMs: 200,

  gravitySamplingPeriodMs: 10,

  gyroscopeMaxReportLatencyMs: 200,

  gyroscopeSamplingPeriodMs: 10,

  magnetometerMaxReportLatencyMs: 200,

  magnetometerSamplingPeriodMs: 10,

  maxNumberOfLogMessagesPerMinute: 100,

  metadataSubmissionInterval: 60_000,

  useGestureRecognizer: true,
};

const reducedCollector = {
  accelerationMaxReportLatencyMs: 200,

  accelerationSamplingPeriodMs: 10,

  collectCoalescedPointerEvents: true,

  collectCoalescedStylusEvents: true,

  collectCoalescedTouchEvents: true,

  collectors: Array<CollectorTypes>(
    CollectorTypes.Battery,
    CollectorTypes.Metadata,
    CollectorTypes.Pointer,
    CollectorTypes.Stylus,
    CollectorTypes.Touch,
  ),

  gravityMaxReportLatencyMs: 200,

  gravitySamplingPeriodMs: 10,

  gyroscopeMaxReportLatencyMs: 200,

  gyroscopeSamplingPeriodMs: 10,

  magnetometerMaxReportLatencyMs: 200,

  magnetometerSamplingPeriodMs: 10,

  maxNumberOfLogMessagesPerMinute: 100,

  metadataSubmissionInterval: 60_000,

  useGestureRecognizer: true
};

export class TrapConfig implements TrapConfigurationType
{
  defaultDataCollection = defaultCollector;

  lowBatteryDataCollection = reducedCollector;

  lowBatteryThreshold = 0.1;

  lowDataDataCollection = reducedCollector;

  queueSize = 10000;

  reporter = reporterConfig;

  sessionIdFilter = undefined;
}
