import { Outlet } from "react-router";

export function LayoutMain() {
    return(
        <main className="h-dvh flex flex-col items-center justify-center p-10">
            <div className="max-w-7xl w-full">
                <Outlet/>
            </div>
        </main>
    )
}