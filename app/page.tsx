import Image from "next/image";
import IdentificationForm from "@/components/home/IdentificationForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center relative">
      <Image src="/images/background-init.webp" alt="Background" fill loading="eager" className="absolute inset-0 -z-1 opacity-5" />
      <div className="flex items-center gap-2 text-xs font-medium font-mono text-(--terminal-green-muted)">
        <div className="bg-(--terminal-green-muted) w-5 h-px" />
        STATUS: Inicializando
        <div className="bg-(--terminal-green-muted) w-5 h-px" />
      </div>
      <h1 className="text-5xl font-semibold font-mono text-(--foreground)">REBOOT</h1>
      <div className="bg-(--terminal-green-opacity) w-full max-w-md h-px mt-6 mb-6" />
      <p className="text-sm font-medium font-mono text-(--accent-color) text-balance max-w-md text-center">EL MUNDO COLAPSÓ.</p>
      <p className="text-sm font-medium font-mono text-(--accent-color) text-balance max-w-md text-center">LA HUMANIDAD ESTÁ AL BORDE DE LA EXTINCIÓN.</p>
      <p className="text-sm font-medium font-mono text-(--accent-color) text-balance max-w-md text-center">TÚ ERES LA ÚLTIMA ESPERANZA.</p>
      <div className="bg-(--terminal-green-opacity) w-full max-w-md h-px mt-6 mb-12" />
      <IdentificationForm />

    </div>

  );
}
