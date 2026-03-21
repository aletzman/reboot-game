interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export default function Logo({ className, width = 120, height = 80 }: LogoProps) {
    return (
        <svg
            viewBox="0 0 120 80"
            fill="none"
            className={className}
            width={width}
            height={height}
        >
            <defs>
                {/* El filtro mágico para el resplandor neón radiactivo */}
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur1" />
                    <feGaussianBlur stdDeviation="4" result="blur2" />
                    <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <rect width="120" height="80" fill="var(--bg-void)" rx="8" />

            <g
                stroke="var(--green-light)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neon-glow)"
            >
                {/* Primer Chevron */}
                <path d="M 20 25 L 40 40 L 20 55" />

                {/* Segundo Chevron */}
                <path d="M 50 25 L 70 40 L 50 55" />

                {/* Guión Bajo (Prompt) */}
                {/* Tip animado: le puedes meter un animate-pulse de Tailwind a este path si quieres que parpadee */}
                <path d="M 85 55 L 105 55" className="animate-pulse" />
            </g>
        </svg>
    );
}