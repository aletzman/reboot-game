interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "outline" | "solid" | "ghost";
}

export default function Button({ children, variant, ...props }: ButtonProps) {
    const variants = {
        outline: "border-(--green-light) border text-(--green-light) hover:bg-(--green-light) hover:text-(--bg-deep) active:bg-(--green-light) active:text-(--bg-deep)",
        solid: "bg-(--green-base) text-(--bg-deep) hover:bg-(--green-light) hover:text-(--bg-deep) active:bg-(--green-light) active:text-(--bg-deep)",
        ghost: "bg-(--green-light-opacity) text-(--green-light) hover:bg-(--green-light) hover:text-(--bg-deep) active:bg-(--green-light) active:text-(--bg-deep)",
    };
    return (
        <button {...props}
            className={`${variants[variant || "solid"]} 
            px-4 py-3 rounded-xs font-semibold font-mono text-xs transition-all duration-200 ease-in-out
            `}>
            {children}
        </button>
    );
}