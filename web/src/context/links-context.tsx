import { createContext, type ReactNode, useContext, useState } from "react";
import { api } from "../libs/api";
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

interface LinkContextType {
    links: ListLinksGet;
    loading: boolean;
    error: string | null;
    fetchLinks: () => Promise<void>;
    exportCSV: () => Promise<void>;
}

export const LinkContext = createContext<LinkContextType | undefined>(undefined);

interface LinkProviderProps {
  children: ReactNode;
}

export function LinkProvider ({ children }: LinkProviderProps){
    const [links, setLinks] = useState<ListLinksGet>({ data:[], total:0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLinks = async () => {
        setLoading(true);
        setError(null);
        
        const urlParams  = new URLSearchParams({page: '1', pageSize: '10'});

        const url = `links?${urlParams.toString()}`;        

        api.get(url)
            .then(({data})=>{
                setLinks(data);
            })
            .catch((error)=>{
                setError(error.toString());
            }).finally(()=>{
                setLoading(false)
            })
    }

    const exportCSV = async ()=>{
        if(!links.total) return;
        
        api.get('links/export')
            .then(async ({ data })=>{
                await downloadUrl(data.reportUrl)
        })
    }

    
    return (
        <LinkContext.Provider value={{links, error, loading, fetchLinks, exportCSV}}>
            {children}
        </LinkContext.Provider>
    )
}

export const useLinks = ()=> {
    const context = useContext(LinkContext);

    if (!context) {
        throw new Error('LinkContext must be used within a LinkProvider');
    }

    return context;
}