import { useParams } from "react-router-dom"
import { useDeviceDetailsLogic } from "../hooks/useDeviceDetailsLogic"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function DeviceDetailsPage() {
    const { imei } = useParams()
    const {
        device,
        loading,
    } = useDeviceDetailsLogic(imei!)

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-6">

            {/* Header Card */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold">
                        {device?.displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        IMEI: {device?.imei}
                    </p>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="trips">Trips</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    {/* Overview cards */}
                </TabsContent>

                <TabsContent value="health">
                    {/* Health UI */}
                </TabsContent>

                <TabsContent value="trips">
                    {/* Trips UI */}
                </TabsContent>
            </Tabs>

        </div>
    )
}