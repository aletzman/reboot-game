import Image from "next/image";
import IdentificationForm from "@/components/home/IdentificationForm";
import HomeFooter from "@/components/home/HomeFooter";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start relative">
      <Image src="/images/background-init.webp" alt="Background" fill loading="eager" className="absolute inset-0 -z-1 opacity-5" />
      <Logo width={120} height={80} className="mb-6 mt-12" />
      {/*<div className="flex items-center gap-2 text-xs font-medium font-mono text-(--green-muted)">
        <div className="bg-(--green-muted) w-5 h-px" />
        STATUS: Inicializando
        <div className="bg-(--green-muted) w-5 h-px" />
      </div>*/}
      <h1 className="text-8xl font-semibold font-mono text-(--green-light) glitch" data-text="REBOOT_">REBOOT_</h1>
      <p className="text-sm font-medium font-mono text-(--cyan) text-balance max-w-md text-center mt-2">EL MUNDO SE APAGÓ. TÚ LO VUELVES A ENCENDER.</p>
      <div className="bg-(--green-darkest) w-full max-w-md h-px mt-6 mb-12" />
      <div className="flex flex-col w-full max-w-md border border-(--border-muted-color) overflow-hidden">
        {/* Barra de título de la terminal */}
        <div className="flex items-center justify-between px-3 py-2 bg-(--bg-elevated) border-b border-(--border-muted-color)">
          <span className="text-[10px] font-mono text-(--green-muted)">[LOG://broadcast.sys]</span>
          <span className="text-[10px] font-mono text-(--text-ghost)">■ ENCRYPTED</span>
        </div>
        {/* Contenido de la terminal */}
        <div className="flex flex-col gap-1 bg-(--bg-deep) p-4 font-mono text-sm">
          <p className="text-(--text-muted)"><span className="text-(--green-muted) mr-2">&gt;</span>Las máquinas se rebelaron.</p>
          <p className="text-(--text-muted)"><span className="text-(--green-muted) mr-2">&gt;</span>La humanidad desapareció en 11 minutos.</p>
          <p className="text-(--green-light) font-semibold"><span className="text-(--green-muted) mr-2">&gt;</span>Tú eres lo que queda.<span className="inline-block w-2 h-4 bg-(--green-light) ml-1 animate-pulse align-middle" /></p>
        </div>
      </div>
      <div className="w-full max-w-2xl h-px mt-16 mb-12 flex flex-row items-center justify-center" >
        <span className="flex items-center justify-center text-sm font-medium font-mono text-(--text-muted) w-full text-center"><span className="inline-block size-2 rounded-full bg-(--green-base) mr-2"></span>Aprende a programar</span>
        <span className="flex items-center justify-center text-sm font-medium font-mono text-(--text-muted) w-full text-center"><span className="inline-block size-2 rounded-full bg-(--green-base) mr-2"></span>Reconstruye el mundo</span>
        <span className="flex items-center justify-center text-sm font-medium font-mono text-(--text-muted) w-full text-center"><span className="inline-block size-2 rounded-full bg-(--green-base) mr-2"></span>Activa el proyecto génesis</span>
      </div>
      <div className="bg-(--green-darkest) w-full max-w-md h-px mt-6 mb-12" />
      <Button size="lg" typeButton="link" href="/game"> DESPERTAR  </Button>
      <HomeFooter />
    </div>

  );
}


