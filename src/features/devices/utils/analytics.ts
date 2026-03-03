import api from "@/lib/axios";

/* =========================================================
   ERROR CLASSES
========================================================= */

export class ApiError extends Error {
  statusCode: number | null;
  retryable: boolean;
  timestamp: string;

  constructor(
    message: string,
    statusCode: number | null = null,
    retryable = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends Error {
  field?: string;
  retryable: boolean = false;
  timestamp: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.timestamp = new Date().toISOString();
  }
}

/* =========================================================
   GRAPHQL WRAPPER (AXIOS)
========================================================= */

async function sendQuery(query: string) {
  if (!query?.trim()) {
    throw new ValidationError("Missing GraphQL query");
  }

  try {
    const response = await api.post(
      "/analytics/analytics-query",
      { query },
      { timeout: 30000 },
    );

    const json = response.data;

    if (json?.errors) {
      throw new ApiError(
        json.errors[0]?.message || "GraphQL Error",
        response.status,
        false,
      );
    }

    return json.data;
  } catch (error: any) {
    const statusCode = error.response?.status ?? null;
    throw new ApiError(
      error.message || "Analytics request failed",
      statusCode,
      statusCode >= 500,
    );
  }
}

/* =========================================================
   TIMESTAMP HELPERS
========================================================= */

export function extractTimestamp(p: any) {
  if (!p) return null;
  const ts = p.deviceTimestamp ?? p.timestamp ?? p.deviceRawTimestamp ?? null;

  if (!ts) return null;

  const d = new Date(ts);
  return isNaN(d.getTime()) ? null : d;
}

export function sortPackets(arr: any[]) {
  if (!Array.isArray(arr)) return [];
  return [...arr].sort((a, b) => {
    const ta = extractTimestamp(a)?.getTime() || 0;
    const tb = extractTimestamp(b)?.getTime() || 0;
    return tb - ta;
  });
}

export function normalize(list: any[]) {
  if (!Array.isArray(list)) return [];
  return list.map((p) => ({
    ...p,
    __timestamp: extractTimestamp(p),
  }));
}

/* =========================================================
   VALIDATION
========================================================= */

function validateAnalyticsData(data: any[]) {
  if (!Array.isArray(data)) {
    throw new ValidationError("Analytics data must be an array");
  }

  return data
    .filter((p) => p && p.id && p.imei)
    .map((p) => ({
      ...p,
      latitude: Number(p.latitude || 0),
      longitude: Number(p.longitude || 0),
      speed: Number(p.speed || 0),
      battery: Number(p.battery || 0),
    }));
}

/* =========================================================
   ANALYTICS METHODS
========================================================= */

export async function getAnalyticsByImei(imei: string) {
  if (!imei) {
    throw new ValidationError("IMEI required", "imei");
  }

  const q = `
  {
    analyticsDataByImei(imei: "${imei}") {
      id
      topic
      imei
      latitude
      longitude
      speed
      battery
      signal
      alert
      type
      timestamp
      deviceTimestamp
      deviceRawTimestamp
      rawTemperature
    }
  }`;

  const result = await sendQuery(q);
  const rawData = result.analyticsDataByImei || [];

  const validated = validateAnalyticsData(rawData);
  const cleaned = normalize(validated);

  return sortPackets(cleaned);
}

export async function getAnalyticsHealth(imei: string) {
  const q = `
  {
    analyticsHealth(imei: "${imei}") {
      gpsScore
      movement
      movementStats
      temperatureHealthIndex
      temperatureStatus
    }
  }`;

  const result = await sendQuery(q);
  return result.analyticsHealth || null;
}

export async function getAnalyticsUptime(imei: string) {
  const q = `
  {
    analyticsUptime(imei: "${imei}") {
      score
      expectedPackets
      receivedPackets
      largestGapSec
      dropouts
    }
  }`;

  const result = await sendQuery(q);
  return result.analyticsUptime || null;
}
