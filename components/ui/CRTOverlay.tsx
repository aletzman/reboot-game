export default function CRTOverlay() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
            style={{ contain: "strict" }}
        >
            {/* Scanlines — usa imagen SVG cacheada por GPU en vez de gradiente CSS */}
            <div className="absolute inset-0 crt-overlay pointer-events-none" />

            {/* Barra de escaneo que baja — solo anima transform (GPU) */}
            <div className="absolute top-0 w-full h-24 bg-linear-to-b from-transparent via-[rgba(85,226,0,0.02)] to-transparent animate-scanline pointer-events-none" />

            {/* Viñeta — radial-gradient estático (más barato que box-shadow) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.40) 100%)",
                }}
            />
        </div>
    );
}
