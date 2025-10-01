import { Outlet } from "react-router";
import { NotificationProvider } from "../context/notification-context";

export function LayoutMain() {
    return (
        <NotificationProvider>
            <main className="h-dvh flex flex-col items-center justify-center p-10">
                <div className="max-w-7xl w-full">
                    <Outlet/>
                </div>
            </main>
        </NotificationProvider>
    )
}