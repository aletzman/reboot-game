import Link from "next/link";



interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "outline" | "solid" | "ghost";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    typeButton?: "button" | "link";
    href?: string;
}

export function Button({ children, variant, size = "md", typeButton = "button", href, ...props }: ButtonProps) {
    const variants = {
        outline: "border-(--green-light) border text-(--green-light) hover:bg-(--green-light) hover:text-(--bg-deep) active:bg-(--green-light) active:text-(--bg-deep)",
        solid: "bg-(--green-base) text-(--bg-deep) hover:bg-(--green-light) hover:text-(--bg-deep) active:bg-(--green-light) active:text-(--bg-deep)",
        ghost: "bg-(--green-light-opacity) text-(--green-light) hover:bg-(--green-light) hover:text-(--bg-deep) active:bg-(--green-light) active:text-(--bg-deep)",
    };
    const sizes = {
        xs: "px-2 py-1 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
    };
    return (
        <>
            {typeButton === "button" ? <button {...props}
                className={`${variants[variant || "solid"]} 
            ${sizes[size || "md"]} rounded-xs font-semibold font-mono transition-all duration-200 ease-in-out
            cursor-pointer
            `}>
                {children}
            </button> : <Link href={href || "#"} className={`${variants[variant || "solid"]} 
            ${sizes[size || "md"]} rounded-xs font-semibold font-mono transition-all duration-200 ease-in-out
            cursor-pointer
            `}>
                {children}
            </Link>}
        </>
    );
}