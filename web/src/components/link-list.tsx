import { DownloadSimpleIcon, LinkIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useLinks } from "../context/links-context";
import { ListItem } from "./list-item";
import { Button } from "./ui/button";


export function LinkList() {
    const { links, loading, fetchLinks, exportCSV } = useLinks();

    useEffect(()=>{
        fetchLinks()
    }, [])

    return (
        <div 
            className="bg-gray-100 overflow-hidden w-full rounded-lg p-8 flex flex-col"
        >
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg text-gray-600">Meus links</p>
                <Button
                    typeButton="secondary"
                    className="h-[32px] w-fit"
                    aria-label="Baixar CSV"
                    onClick={exportCSV}
                    disabled={!links.total || loading}
                >
                    <DownloadSimpleIcon className="text-gray-600"/>
                </Button>
            </div>
            
            {!links.total && loading  && (
                <div className="h-full flex flex-col items-center justify-center border-t-2 border-gray-200 ">
                    <SpinnerIcon className="animate-spin h-10 w-10" />
                    <span className="text-xs uppercase text-gray-500">
                        Carregando...
                    </span>
                </div>
            )}

            {!links.total &&  !loading && (
                <div className="h-full flex flex-col items-center justify-center border-t-2 border-gray-200">
                    <LinkIcon className="size-8 text-gray-400" />
                    <span className="text-xs uppercase text-gray-500">
                        Ainda não existem links cadastrados
                    </span>      
                </div>
            )}

            {links.data.map((link) =>(
                <ListItem 
                    key={link.id}
                    link={link} 
                />
            ))}
        
    
        </div>
    )
}