import { useEffect, useState } from "react";
import { useNavigate, useParams  } from "react-router";
import LogoIcon from '../assets/logo_icon.svg';
import { api } from "../libs/api";

export function RedirectPage() {
    const { shortUrl } = useParams();
    const [url, setUrl] = useState('')
    let navigate = useNavigate();

    useEffect(()=>{
        api.get(`link/${shortUrl}`)
            .then(({ data })=>{
                setUrl(data.url)
                window.location.replace(data.url);
            }).catch(({response})=>{
                if(response.data.message === 'Not found'){
                    navigate(`/notFound/${shortUrl}`, {replace: true})
                }
            })
    }, [])
    

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col gap-4 bg-gray-100 overflow-hidden w-full md:w-[580px] rounded-lg justify-center items-center text-center py-16 px-8">
                <span className="text-xl text-gray-600">Redirecionando...</span>
                <span>
                    <p className="text-gray-500">
                        O link será aberto automaticamente em alguns instantes. 
                    </p>
                    <p className="text-gray-500">
                        Não foi redirecionado? 
                        {' '}
                        <a href={url} target='_blank' className="text-blue-base">
                            Acesse aqui
                        </a>
                    </p>
                </span>
                
                <img
                    src={LogoIcon}
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                    loading="lazy"
                />
            </div>
        </div>
    )
}