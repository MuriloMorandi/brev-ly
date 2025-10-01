import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { useLinks } from "../context/links-context";
import { api } from "../libs/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNotification } from "../context/notification-context";
import type { AxiosError } from "axios";

const createLinkSchema = z.object({
    url: z.url('Informe uma url válida.'),
    shortUrl: z.string().trim()
        .min(1, "Informe uma url minúscula e sem espaço/caracter especial.")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Informe uma url minúscula e sem espaço/caracter especial."),
});

type CreateLinkSchema = z.infer<typeof createLinkSchema>

export function LinkForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm<CreateLinkSchema>({
        resolver: zodResolver(createLinkSchema),  
    })
    const { fetchLinks } = useLinks();
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleForm = (data: CreateLinkSchema)=>{
        setLoading(true);
        api.post('links', data).then(()=>{
            reset();
            showNotification('Link criado com sucesso!', 'success');
            fetchLinks();
        }).catch(({ response, status}: AxiosError) => {
            if (status === 409 || status === 400)
            {
                const data = response?.data as {
                    message: string;
                    issues: (keyof CreateLinkSchema)[]
                };

                const message = data.message === 'Short URL already exists'
                    ? 'O link encurtado já existe.'
                    : data.message;
                
                const field = data.issues[0];

                setError(field, { message });
            }
            console.error('');
                
        }).finally(()=>{
            setLoading(false);
        })
    }

    return (
        <div
            className="flex flex-col gap-4 bg-gray-100 overflow-hidden w-full md:w-[380px] rounded-lg p-8 max-h-fit"
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
                    placeholder='www.exemplo.com.br'
                    disabled={loading}
                    {...register('url')}
                />

                <Input 
                    title="LINK ENCURTADO" 
                    errorMessage={errors?.shortUrl?.message}
                    disabled={loading}
                    {...register('shortUrl')}
                />

                <Button
                    typeButton="primary"
                    aria-label="Salvar link"
                    type="submit"
                    loading={loading}
                />

            </form>
        </div>
    )
}