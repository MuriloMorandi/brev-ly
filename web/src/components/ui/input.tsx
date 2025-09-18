import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: `
    text-gray-500
    border
    border-gray-300
    rounded-md
    px-3 py-2
    outline-none
    focus:border-blue-base
  `,
  variants: {
    error: {
      true: 'text-danger border-danger focus:border-danger',
    },
  },
})

const titleVariants = tv({
  base: `
    text-gray-500 
    transition-colors
    group-focus-within:text-blue-base
  `,
  variants: {
    error: {
      true: 'text-danger group-focus-within:text-danger',
    },
  },
})

type InputProps = ComponentProps<'input'> &
  VariantProps<typeof inputVariants> & {
    title?: string
    errorMessage?: string
  }

export function Input({ title, errorMessage, className,  ...props }: InputProps) {
  const error = !!errorMessage
  return (
    <div className="flex flex-col group">
      <p
        className={titleVariants({ error })}
      >
        {title}
      </p>
      <input className={inputVariants({ error, className })} {...props}/>
      {errorMessage ?
        <p className="text-danger text-sm">
            {errorMessage}
        </p> : undefined}
    </div>
  )
}

