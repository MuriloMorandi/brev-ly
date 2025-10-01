import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { api } from "../libs/api";
import { downloadUrl } from "../utils/download-url";
import { useNotification } from "./notification-context";

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
    deleteLink: (id: string) => Promise<void>;
}

export const LinkContext = createContext<LinkContextType | undefined>(undefined);

interface LinkProviderProps {
  children: ReactNode;
}

export function LinkProvider ({ children }: LinkProviderProps){
    const [links, setLinks] = useState<ListLinksGet>({ data:[], total:0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { showNotification } = useNotification();

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
                showNotification(`Erro ao buscar links: ${error.toString()}`, 'error');
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

    const deleteLink = async (id: string) => {
        setLoading(true);
        api.delete(`links/${id}`)
            .then(() => {
                fetchLinks();
                showNotification('Link deletado com sucesso!', 'success');
            })
            .catch((error) => {
                showNotification(`Erro ao deletar link: ${error.toString()}`, 'error');
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const value = useMemo(
        () => ({ links, error, loading, fetchLinks, exportCSV, deleteLink }),
        [links, error, loading]
    );

    return (
        <LinkContext.Provider value={value}>
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