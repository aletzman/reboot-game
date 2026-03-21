import Input from "../ui/Input";
import Button from "../ui/Button";

export default function IdentificationForm() {
    return (
        <form action="" className="relative flex flex-col gap-2 bg-(--surface-a) p-6 border-(--border-muted-color) border">
            <div className="absolute top-0 left-0 w-3 h-px bg-(--terminal-green-active)" />
            <div className="absolute top-0 left-0 w-px h-3 bg-(--terminal-green-active)" />
            <div className="absolute bottom-0 right-0 w-3 h-px bg-(--terminal-green-active)" />
            <div className="absolute bottom-0 right-0 w-px h-3 bg-(--terminal-green-active)" />
            <Input placeholder="ESCRIBE TU NOMBRE" label="IDENTIFICACIÓN_USUARIO" />
            <Input placeholder="ESCRIBE TU CÓDIGO GENÉTICO" label="MATRIZ_BIOMÉTRICA" />
            <Button type="button" variant="solid">INICIALIZAR SISTEMA</Button>
        </form>
    );
}