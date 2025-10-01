import Icon404 from '../assets/404.svg';

export function NotFoundPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">        
        <div className="flex flex-col gap-4 bg-gray-100 overflow-hidden w-full md:w-[580px] rounded-lg justify-center items-center text-center py-16 px-8">
            <img
                src={Icon404}
                alt="Logo"
                className=" h-20 object-contain"
                loading="lazy"
            />

            <span className="text-xl text-gray-600">Link não encontrado</span>
            <p>
                O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em 
                {' '}
                <a href={'/home'} className="text-blue-base">
                    brev.ly
                </a>.
            </p>
            </div>
        </div>
    )
}