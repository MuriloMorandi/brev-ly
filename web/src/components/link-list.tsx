import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { api } from "../libs/api";
import { ListItem } from "./list-item";
import { Button } from "./ui/button";
import { downloadUrl } from "../utils/download-url";

export type ListLinksGet = {
    data: {
        id: string;
        url: string;
        shortUrl: string;
        accessCount: number;
        createdAt: Date;
        updatedAt: Date | null;
    }[];
    total: number;
}

export function LinkList() {
    const [{ data, total}, setData] = useState<ListLinksGet>({ data:[], total:0 });

    const fetchData = async ()=>{
        api.get(`links/?page=1&pageSize=10`).then(({ data })=>{
            setData(data)
        })
    }

    const donwloadCSV = async ()=>{
        api.get('links/export')
            .then(async ({ data })=>{
                console.log(data)
                await downloadUrl(data.reportUrl)
            })
    }

    useEffect(()=>{
        fetchData()
    }, [])

    return (
        <div 
            className="bg-gray-100 overflow-hidden w-full h rounded-lg p-8 flex flex-col gap-4"
        >
            <div className="flex justify-between">
                <p className="text-lg text-gray-600">Meus links</p>
                <Button
                    typeButton="secondary"
                    className="h-[32px] w-fit"
                    aria-label="Baixar CSV"
                    onClick={donwloadCSV}
                >
                    <DownloadSimpleIcon className="text-gray-600"/>
                </Button>
            </div>
                
            <div>
                {data.map((link) =>(
                    <ListItem 
                        key={link.id}
                        link={link} 
                        loadingData={fetchData}
                    />
                ))}
            </div>
    
        </div>
    )
}