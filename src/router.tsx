import { createBrowserRouter } from "react-router-dom"

import Dashboard from "@/Pages/Dashboard"
import GuestMiddleware from "./middleware/GuestMiddleware"
import RequireAuth from "./middleware/RequireAuth"
import LoginPage from "./Pages/Auth/login"
import AppLayout from "./layouts/AppLayout"
import DeviceSettings from "./Pages/DeviceSettings"
import DevicesPage from "./features/devices/pages/DevicePage"
import DeviceDetailsPage from "./features/devices/pages/DeviceDetails"

export const router = createBrowserRouter([
    {
        element: <RequireAuth />,
        children: [
            {
                path: "/",
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },

                    {
                        path: "devices",
                        children: [
                            {
                                path: "list",
                                element: <DevicesPage />, // /devices/list
                            },
                            {
                                path: ":imei",
                                element: <DeviceDetailsPage />, // /devices/:imei
                            },
                            {
                                path: "settings",
                                element: <DeviceSettings />, // /devices/settings
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        element: <GuestMiddleware />,
        children: [
            {
                path: "/auth/login",
                element: <LoginPage />,
            },
        ],
    },
])