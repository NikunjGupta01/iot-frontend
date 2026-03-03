import { useEffect, useState, useCallback } from "react"
import { listDevices, Device } from "../services/deviceService"

export function useDevices() {
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDevices = useCallback(async () => {
        try {
            setLoading(true)
            const data = await listDevices()
            console.log(data);

            setDevices(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDevices()
    }, [fetchDevices])

    return {
        devices,
        loading,
        error,
        refresh: fetchDevices,
    }
}