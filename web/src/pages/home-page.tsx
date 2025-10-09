import { LinkForm } from "../components/link-form";
import { LinkList } from "../components/link-list";
import { LinkProvider } from "../context/links-context";
import Logo_Icon from '../assets/logo_icon.svg';

export function HomePage() {
    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex gap-2 justify-center md:justify-start">
                <img
                    src={Logo_Icon}
                    alt="Logo"
                    className="w-6 object-contain"
                    loading="lazy"
                />
                <span className="text-2xl font-bold text-blue-base md:text-center">
                    Brev.ly
                </span>
            </div>
            
        <div className="flex flex-col md:flex-row gap-3 w-full">
            <LinkProvider>
                <LinkForm />
                <LinkList />
            </LinkProvider>
            </div>
        </div>
    )
}
