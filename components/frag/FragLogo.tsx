import { motion } from "motion/react";

interface FragLogoProps {
    size?: number | string; // 96 | "6rem" | "100px"
}

export function FragLogo({ size = 96 }: FragLogoProps) {
    return (
        <div
            className="relative inline-block"
            style={{
                width: typeof size === "number" ? `${size}px` : size,
                height: typeof size === "number" ? `${size}px` : size,
            }}
        >
            {/* Glow púrpura */}
            <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                    background:
                        "radial-gradient(circle, #a855f7 0%, transparent 70%)",
                }}
                animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Núcleo energético */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle at center, #c084fc55, transparent 60%)",
                }}
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Imagen principal */}
            <motion.img
                src="/assets/frag_logo.webp"
                alt="FRAG AI"
                className="relative z-10 w-full h-full select-none"
                animate={{
                    y: [0, -4, 0],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Glitch sutil */}
            <motion.div
                className="absolute inset-0 z-20"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, #c084fc55, transparent)",
                }}
                animate={{
                    x: [0, 6, -6, 0],
                    opacity: [0, 0.15, 0],
                }}
                transition={{
                    duration: 0.25,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}