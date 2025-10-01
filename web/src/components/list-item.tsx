import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { NavLink } from "react-router";
import { useLinks } from "../context/links-context";
import { ButtonIcon } from "./ui/button-icon";

type ListItem = {
    id: string;
    url: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export function ListItem({ link}: { link:ListItem }){
    const { deleteLink, loading } = useLinks();

    const handleRemove = ()=>{
        deleteLink(link.id);
    }

    return(
        <div 
            key={link.id} 
            className="h-auto p-1 md:p-2 border-t-2 border-gray-200 flex flex-row md:items-center md:gap-5 gap-2"
        >
            <div className="flex-1 min-w-0">
                <NavLink
                    to={`/${link.shortUrl}`}
                    className="text-md text-blue-base truncate hover:underline block"
                > 
                    {link.shortUrl}
                </NavLink>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                    {link.url}
                </p>
            </div>
            <div className="shrink-0 flex items-center">
                <p className="whitespace-nowrap tabular-nums text-sm text-gray-500">{link.accessCount} acessos</p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
                <ButtonIcon 
                    onClick={() => { navigator.clipboard.writeText(link.url) }}
                    disabled={loading}
                >
                    <CopyIcon className="text-gray-600"/>
                </ButtonIcon>
                <ButtonIcon
                    onClick={handleRemove}
                    disabled={loading}
                >
                    <TrashIcon className="text-gray-600"/>
                </ButtonIcon>
            </div>
        </div>
    )
}