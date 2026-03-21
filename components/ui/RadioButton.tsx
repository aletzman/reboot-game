import { useState, useEffect } from "react";

interface RadioOption {
    label: string;
    value: string;
}

interface RadioButtonProps {
    title?: string;
    options: RadioOption[];
    checked: string;
    onChange: (value: string) => void;
}

export default function RadioButton({ title, options, checked, onChange }: RadioButtonProps) {
    const [selected, setSelected] = useState(checked);

    useEffect(() => {
        setSelected(checked);
    }, [checked]);

    const handleSelect = (value: string) => {
        setSelected(value);
        onChange(value);
    };

    return (
        <div className="flex flex-col gap-2">
            {title && <span className="text-[10px] font-medium font-mono text-(--text-muted)">[{title}]</span>}
            <div className="flex gap-3">
                {options.map((option) => {
                    const isSelected = selected === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`flex-1 p-2 border text-xs font-medium font-mono transition-colors duration-200 focus:outline-none
                                ${isSelected
                                    ? "bg-(--green-darkest) border-(--green-light) text-(--green-light)"
                                    : "bg-(--bg-elevated) border-(--bg-hover) text-(--text-muted) hover:border-(--green-light) hover:text-(--green-light)"
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}