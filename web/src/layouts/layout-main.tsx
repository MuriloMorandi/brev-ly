import { Outlet } from "react-router";

export function LayoutMain() {
    return(
        <main className="h-dvh flex flex-col items-center justify-center p-10">
            <Outlet/>
        </main>
    )
}