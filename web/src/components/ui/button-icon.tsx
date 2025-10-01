import { SpinnerIcon } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
    base: `
        h-8
        w-8
        flex
        items-center
        justify-center
        rounded-sm
        bg-gray-200
        px-2
        text-gray-500
        hover:border-1
        hover:border-blue-dark
        cursor-pointer
    `,  
    variants: {
        disabled: {
            true: 'opacity-50 pointer-events-none'
        }
    }
})

type ButtonIconProps = ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
    children: React.ReactNode
    loading?: boolean
}

export function ButtonIcon({className, children, disabled, loading, ...props }: ButtonIconProps){
    return(
        <button 
            className={buttonVariants({disabled, className })}
            {...props}
        >
            {loading ? (
                <SpinnerIcon className="animate-spin h-5 w-5" />
            ) : (
                children
            )}
        </button>
    )
}