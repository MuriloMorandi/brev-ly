import type { ComponentProps } from "react";

type ButtonIconProps = ComponentProps<"button"> & {
    children: React.ReactNode
}

export function ButtonIcon({className, children, ...props }: ButtonIconProps){
    return(
        <button 
            className='h-8 w-8 flex items-center justify-center rounded-sm bg-gray-200 px-2 text-gray-500 hover:border-1 hover:border-blue-dark cursor-pointer'
            {...props}
            >
            {children}
        </button>
    )
}