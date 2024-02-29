export interface CapacitorTrapPlugin {
  /**
   * Add custom event
   */
  addCustomEvent(options: { event: any }): Promise<void>;

  /**
   * Add custom metadata
   */
  addCustomMetadata(options: { key: string, value: any }): Promise<void>;

  /**
   * Checks permission for the specific collector. Returns true if the collector
   * has the required permission.
   */
  checkPermission(options: { collector: CollectorTypes })
    : Promise<PermissionResult>;

  /**
   * Initialize the plugin
   */
  configure(options: { config: TrapConfigurationType }): Promise<void>;

  /**
   * Cleans up the plugin
   */
  cleanUp(): Promise<void>;

  /**
   * Remove custom metadata
   */
  removeCustomMetadata(options: { key: string }): Promise<void>;

  /**
   * Request permission for the specific collector.
   */
  requestPermission(options: { collector: CollectorTypes }) : Promise<void>;

  /**
   * Start data collection
   */
  start(): Promise<void>;

  /**
   * Stop data collection
   */
  stop(): Promise<void>;
}

export enum CollectorTypes {
  Accelerometer = 'Accelerometer',
  Battery = 'Battery',
  Bluetooth = 'Bluetooth',
  CoarseLocation = 'CoarseLocation',
  Gravity = 'Gravity',
  Gyroscope = 'Gyroscope',
  Magnetometer = 'Magnetometer',
  Metadata = 'Metadata',
  Pointer = 'Pointer',
  PreciseLocation = 'PreciseLocation',
  Stylus = 'Stylus',
  Touch = 'Touch',
  WiFi = 'WiFi',
}

export interface DataCollectionConfigurationType {
  /**
   * How long the sensor can cache reported events.
   */
  accelerationMaxReportLatencyMs: number;

  /**
   * How frequent the sampling of the given sensor should be.
   */
  accelerationSamplingPeriodMs: number;

  /**
   * Collect coalesced pointer events
   */
  collectCoalescedPointerEvents: boolean;

  /**
   * Collect coalesced stylus events
   */
  collectCoalescedStylusEvents: boolean;

  /**
   * Collect coalesced touch events
   */
  collectCoalescedTouchEvents: boolean;

  /**
   * The list of collectors to start at initialization.
   */
  collectors: CollectorTypes[];

  /**
   * How long the sensor can cache reported events.
   */
  gravityMaxReportLatencyMs: number;

  /**
   * How frequent the sampling of the given sensor should be.
   */
  gravitySamplingPeriodMs: number;

  /**
   * How long the sensor can cache reported events.
   */
  gyroscopeMaxReportLatencyMs: number;

  /**
   * How frequent the sampling of the given sensor should be.
   */
  gyroscopeSamplingPeriodMs: number;

  /**
   * How long the sensor can cache reported events.
   */
  magnetometerMaxReportLatencyMs: number;

  /**
   * How frequent the sampling of the given sensor should be.
   */
  magnetometerSamplingPeriodMs: number;

  /**
   * Maximum number of log messages per collector if the collector uses log throttling
   */
  maxNumberOfLogMessagesPerMinute: number;

  /**
   * The time interval metadata events are reported.
   */
  metadataSubmissionInterval: number;

  /**
   * Use gesture recognizer for touch event collection
   */
  useGestureRecognizer: boolean;
}

export interface PermissionResult {
  result: boolean;
}

export interface ReporterConfigurationType {
  /**
   * Name of the api key sent in the HTTP header
   */
  apiKeyName: string;

  /**
   * Value of the api key sent in the HTTP header
   */
  apiKeyValue: string;

  /**
   * Whether to cache data packets on the device
   * when connection to the remote server cannot be
   * established.
   */
  cachedTransport: boolean;

  /**
   * Whether to compress the data sent to the server.
   * If true GZIP compression is used.
   */
  compress: boolean;

  /**
   * The connect timeout for the HTTP transport
   * in milliseconds.
   */
  connectTimeout: number;

  /**
   * The time interval the reporter task runs with.
   */
  interval: number;

  /**
   * About how much space on the device can be
   * used to store unsent data packets.
   *
   * The lib might use a little more space than this
   * value in case the data packet size exceeds the
   * remaining space.
   */
  maxFileCacheSize: number;

  /**
   * The read timeout for the HTTP transport
   * in milliseconds.
   */
  readTimeout: number;

  /**
   * The persistent session id to send in the
   * header frame. Must be set manually
   * with a custom config class!
   */
  sessionId: string;

  /**
   * The URL to send the data packets to.
   */
  url: string;
}

export interface TrapConfigurationType {
  /**
   * Default data collection options.
   */
  defaultDataCollection: DataCollectionConfigurationType;

  /**
   * Limited data collection in case of low battery
   */
  lowBatteryDataCollection: DataCollectionConfigurationType;

  /**
   * Limited data collection in case of low battery
   */
  lowDataDataCollection: DataCollectionConfigurationType;

  /**
   * Battery charge threshold for low battery status
   */
  lowBatteryThreshold: number;

  /**
   * The size of the circular data queue.
   */
  queueSize: number;

  /**
   * The configuration for the reporter task.
   */
  reporter: ReporterConfigurationType;

  /**
   * SessionId filter, if specified the data collection is only enabled
   * if sessionId <= sessionIdFilter
   */
  sessionIdFilter: string | undefined;
}
