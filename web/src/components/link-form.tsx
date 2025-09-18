import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { api } from "../libs/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const createLinkSchema = z.object({
    url: z.url(),
    shortUrl: z.string().trim().min(1, "Short URL cannot be empty"),
});

type CreateLinkSchema = z.infer<typeof createLinkSchema>

export function LinkForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateLinkSchema>({
        resolver: zodResolver(createLinkSchema),
        
    })

    const handleForm = (data: CreateLinkSchema)=>{
        api.post('links', data).then(()=>{
            reset()
        }).catch((erro)=>{
            console.error(erro)
        })
    }

    return (
        <div
            className="flex flex-col gap-4 bg-gray-100 overflow-hidden w-[380px] h-[340px] rounded-lg p-8"            
        >
            <p className="text-lg text-gray-600">Novo link</p>
            
            <form 
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(handleForm)}
            >
                <Input 
                    title="LINK ORIGINAL" 
                    errorMessage={errors?.url?.message}  
                    type="url"
                    {...register('url')}
                />

                <Input 
                    title="LINK ENCURTADO" 
                    errorMessage={errors?.shortUrl?.message}   {...register('shortUrl')}
                />

                <Button
                    typeButton="primary"
                    aria-label="Salvar link"
                    type="submit"
                />
            </form>
        </div>
    )
}