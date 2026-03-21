interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "outline" | "solid" | "ghost";
}

export default function Button({ children, variant, ...props }: ButtonProps) {
    const variants = {
        outline: "border-(--terminal-green) border text-(--terminal-green) hover:bg-(--terminal-green) hover:text-(--background) active:bg-(--terminal-green-active) active:text-(--background)",
        solid: "bg-(--terminal-green-active) text-(--background) hover:bg-(--terminal-green-hover) hover:text-(--background) active:bg-(--terminal-green-active) active:text-(--background)",
        ghost: "bg-(--terminal-green-opacity) text-(--terminal-green-active) hover:bg-(--terminal-green) hover:text-(--background) active:bg-(--terminal-green-active) active:text-(--background)",
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