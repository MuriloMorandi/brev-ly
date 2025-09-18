import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants"


const buttonVariants = tv({
    base: `
        flex
        items-center
        justify-center
        rounded-md
        cursor-pointer
        h-[48px]
        w-full
        text-md
    `,  
    variants: {
        typeButton: {
            primary: "bg-blue-base hover:bg-blue-dark px-5 text-white",
            secondary: "bg-gray-200 px-2 text-gray-500 hover:border-1 hover:border-blue-dark"
        },
        disabled: {
            true: 'opacity-50 pointer-events-none'
        }
    },
    defaultVariants: {
        typeButton: "primary"        
    }
})

type ButtonProps = ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        
};
    
export function Button({
    typeButton,
    disabled,
    className,
    ...props
 }:ButtonProps) {
    return (
        <button
            className={buttonVariants({ typeButton, disabled, className })}
            {...props}
        >
            <span>{props["aria-label"]}</span>
        </button>
    )
}