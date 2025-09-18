import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { api } from "../libs/api";
import { ButtonIcon } from "./ui/buttonIcon";

type ListItem = {
    id: string;
    url: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export function ListItem({ link, loadingData }: { link:ListItem, loadingData: () => void }){

    const handleRemove = ()=>{
        api.delete(`links/?id=${link.id}`)
            .then(loadingData)
            .catch((error)=>console.log(error))
    }

    return(
        <div key={link.id} className="h-[42px] border-t-1 broder-grey-200 flex items-center gap-5">
            <div className="w-full">
                <p className="text-md text-blue-base">{link.shortUrl}</p>
                <p className="text-sm text-gray-500">{link.url}</p>
            </div>
            <div className="w-fit">
                <p className="whitespace-nowrap tabular-nums">{link.accessCount} acessos</p>
            </div>
            <div className="flex gap-1">
                <ButtonIcon onClick={()=>{navigator.clipboard.writeText(link.url)}}>
                    <CopyIcon className="text-gray-600"/>
                </ButtonIcon>
                <ButtonIcon onClick={handleRemove}>
                    <TrashIcon className="text-gray-600"/>
                </ButtonIcon>
            </div>
        </div>
    )
}