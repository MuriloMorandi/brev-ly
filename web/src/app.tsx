import { LinkForm } from "./components/link-form";
import { LinkList } from "./components/link-list";

export function App() {

  return (
    <main className="h-dvh flex-col items-center justify-center p-10">
      <div className="flex flex-row gap-3">
        <LinkForm />
        <LinkList/>
      </div>
    </main>
  )
}

