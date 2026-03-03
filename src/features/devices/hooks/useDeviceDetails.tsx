import { useEffect, useState } from "react"
import {
    getAnalyticsByImei,
    getAnalyticsHealth,
    getAnalyticsUptime,
} from "@/utils/analytics"
import { getDeviceByTopic } from "@/features/devices/services/deviceService"

export function useDeviceDetails(imei: string) {
    const [packets, setPackets] = useState<any[]>([])
    const [device, setDevice] = useState<any>(null)
    const [health, setHealth] = useState<any>(null)
    const [uptime, setUptime] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    async function load() {
        try {
            const analytics = await getAnalyticsByImei(imei)
            const healthData = await getAnalyticsHealth(imei)
            const uptimeData = await getAnalyticsUptime(imei)

            setPackets(normalizePackets(analytics))
            setHealth(healthData)
            setUptime(uptimeData)

            const topic =
                analytics?.[0]?.topic || `${imei}/pub`

            const deviceData = await getDeviceByTopic(topic)
            setDevice(deviceData)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
        const interval = setInterval(load, 10000)
        return () => clearInterval(interval)
    }, [imei])

    return {
        packets,
        device,
        health,
        uptime,
        loading,
        refresh: load,
    }
}