"use client";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { RadioButton } from "../ui/RadioButton";

export default function IdentificationForm() {
    return (
        <form action="" className="relative flex flex-col gap-7 bg-(--bg-deep) p-6 border-(--border-muted-color) border w-full max-w-sm">
            <div className="absolute top-0 left-0 w-3 h-px bg-(--green-muted)" />
            <div className="absolute top-0 left-0 w-px h-3 bg-(--green-muted)" />
            <div className="absolute bottom-0 right-0 w-3 h-px bg-(--green-muted)" />
            <div className="absolute bottom-0 right-0 w-px h-3 bg-(--green-muted)" />
            <Input placeholder="ESCRIBE TU NOMBRE" label="IDENTIFICACIÓN_USUARIO" />
            <RadioButton title="MATRIZ_BIOMÉTRICA"
                options={[
                    { label: "MASCULINO", value: "male" },
                    { label: "FEMENINO", value: "female" },
                    { label: "NEUTRO", value: "neutral" }
                ]}
                checked="male" onChange={(value) => console.log(value)} />
            <Button type="button" variant="solid">INICIALIZAR SISTEMA</Button>

            <div className="flex items-center justify-between gap-2 text-[10px] font-medium font-mono text-(--green-muted)">
                <span className="text-(--green-dark)">SYS_AUTH_LEVEL: 1</span>
                <span className="text-(--green-dark)">KERNEL_REV: 0.0.1</span>
            </div>

        </form>
    );
}