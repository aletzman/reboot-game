"use client";
import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { RadioButton } from "../ui/RadioButton";

interface IdentificationFormProps {
    onSubmit?: (data: { name: string; gender: string }) => void;
    defaultName?: string;
    defaultGender?: string;
}

export default function IdentificationForm({ onSubmit, defaultName = "", defaultGender = " " }: IdentificationFormProps) {
    const [name, setName] = useState(defaultName);
    const [gender, setGender] = useState(defaultGender);
    const [error, setError] = useState<string | null>(null);

    const formAction = async (formData: FormData) => {
        // Aprovechamos los actions de React 19. El preventDefault() es automático.
        if (!name.trim() || !gender.trim() || gender.trim() === "") {
            setError("SE REQUIEREN TODOS LOS DATOS.");
            return;
        }

        if (name.trim().length < 3) {
            setError("LA IDENTIDAD DEBE TENER AL MENOS 3 CARACTERES.");
            return;
        }

        setError(null);
        if (onSubmit) {
            onSubmit({ name, gender });
        }
    };

    return (
        <form action={formAction} className="relative flex flex-col gap-7 bg-(--bg-deep) p-6 border-(--border-muted-color) border w-full max-w-sm shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50">
            <div className="absolute top-0 left-0 w-3 h-px bg-(--green-muted)" />
            <div className="absolute top-0 left-0 w-px h-3 bg-(--green-muted)" />
            <div className="absolute bottom-0 right-0 w-3 h-px bg-(--green-muted)" />
            <div className="absolute bottom-0 right-0 w-px h-3 bg-(--green-muted)" />

            <Input
                placeholder="ESCRIBE TU NOMBRE"
                label="IDENTIFICACIÓN_USUARIO"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <RadioButton title="MATRIZ_BIOMÉTRICA"
                options={[
                    { label: "MASCULINO", value: "male" },
                    { label: "FEMENINO", value: "female" },
                    { label: "NEUTRO", value: "neutral" }
                ]}
                checked={gender}
                onChange={(value) => setGender(value)}
            />

            <Button type="submit" variant="solid">INICIALIZAR SISTEMA</Button>

            {error && (
                <div className="text-(--red) text-xs font-mono font-semibold text-center animate-pulse">
                    ! {error}
                </div>
            )}

            <div className="flex items-center justify-between gap-2 text-[10px] font-medium font-mono text-(--green-muted)">
                <span className="text-(--green-dark)">SYS_AUTH_LEVEL: 1</span>
                <span className="text-(--green-dark)">KERNEL_REV: 0.0.1</span>
            </div>
        </form>
    );
}