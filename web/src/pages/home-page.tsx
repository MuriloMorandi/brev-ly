import { LinkForm } from "../components/link-form";
import { LinkList } from "../components/link-list";
import { LinkProvider } from "../context/links-context";

export function HomePage() {
    return(
        <div className="flex flex-row gap-3 w-full">
            <LinkProvider>
                <LinkForm />
                <LinkList/>
            </LinkProvider>
        </div>
    )
}