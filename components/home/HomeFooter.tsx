export default function HomeFooter() {
    return (
        <footer className="flex items-center justify-between p-2 bg-(--bg-surface) w-full absolute bottom-0">
            <span className="text-xs font-medium font-mono text-(--green-light) opacity-50"><span className="inline-block size-2 rounded-full bg-(--green-light) animate-pulse mr-2" /> SISTEMA ACTIVO</span>
            <span className="text-xs font-medium font-mono text-(--cyan) opacity-50">ENCRYPTION: AES-256-GCM</span>
        </footer>
    );
}