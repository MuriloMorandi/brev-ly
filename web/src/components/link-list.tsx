import { Button } from "./ui/button";

export function LinkList() {
    return (
        <div 
            className="bg-gray-100 overflow-hidden w-full rounded-lg p-8 flex flex-col gap-4"
        >
            <div className="flex justify-between">
                <p className="text-lg text-gray-600">Meus links</p>
                <Button
                    typeButton="secondary"
                    className="h-[32px] w-fit"
                    aria-label="Baixar CSV"
                />
            </div>
                
            <div className="border-t-1 broder-grey-200">
                
            </div>
    
        </div>
    )
}