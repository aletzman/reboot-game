interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ placeholder, value, onChange, label, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={label} className="text-[10px] font-medium font-mono text-(--text-muted)">[{label}]</label>
            <div className=" border-b-(--border-color) border-b p-2 flex items-center gap-4 bg-(--bg-elevated)" >
                <span className="text-(--green-muted) font-bold text-xs font-mono">C:\&gt;</span>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="text-md font-medium font-mono text-(--green-light) placeholder:text-(--green-base) placeholder:text-xs focus:outline-none"
                    {...props}
                />
            </div>

        </div>
    );
}