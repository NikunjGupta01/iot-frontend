import { useEffect, useState, useCallback } from "react"
import {
    getAnalyticsByImei,
    getAnalyticsHealth,
    getAnalyticsUptime,
} from "../utils/analytics"
import { getDeviceByTopic } from "../services/deviceService"
import { detectTrips } from "../utils/tripDetection"

export function useDeviceDetailsLogic(imei: string) {
    const [packets, setPackets] = useState<any[]>([])
    const [device, setDevice] = useState<any>(null)
    const [health, setHealth] = useState<any>(null)
    const [uptime, setUptime] = useState<any>(null)
    const [trips, setTrips] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        try {
            setLoading(true)

            const packetsData = await getAnalyticsByImei(imei)
            const healthData = await getAnalyticsHealth(imei)
            const uptimeData = await getAnalyticsUptime(imei)

            const topic =
                packetsData?.[0]?.topic || `${imei}/pub`

            const deviceData = await getDeviceByTopic(topic)

            setPackets(packetsData || [])
            setHealth(healthData)
            setUptime(uptimeData)
            setDevice(deviceData)

            // Reuse your old logic here
            setTrips(detectTrips(packetsData || []))

        } finally {
            setLoading(false)
        }
    }, [imei])

    useEffect(() => {
        load()
        const interval = setInterval(load, 10000)
        return () => clearInterval(interval)
    }, [load])

    return {
        packets,
        device,
        health,
        uptime,
        trips,
        loading,
        refresh: load,
    }
}