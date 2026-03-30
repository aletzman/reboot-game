"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Map, ChevronRight, Binary, Cpu, ArrowLeft, ShelvingUnit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

import { NavButton } from "./NavButton";

const navItems = [
    {
        href: "/game",
        label: "SECTORES",
        icon: Map,
        color: "var(--green-light)",
        tag: "0x01_MAP"
    },
    {
        href: "/game/collection",
        label: "ALMACÉN",
        icon: ShelvingUnit,
        color: "var(--cyan)",
        tag: "0x02_DB"
    },
    {
        href: "/game/collection/cards",
        label: "MODULOS",
        icon: Binary,
        color: "var(--amber)",
        tag: "0x03_MOD"
    },
    {
        href: "/game/collection/objects",
        label: "OBJETOS",
        icon: Cpu,
        color: "var(--blue)",
        tag: "0x04_OBJ"
    },
];

export function NavigationFooter() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || pathname === "/") return null;

    const isLevel = pathname.includes("/level/");
    const pathParts = pathname.split("/");
    const actId = pathParts.length > 2 && pathParts[1] === "game" ? pathParts[2] : null;

    return (
        <AnimatePresence mode="wait">
            <motion.footer
                key="footer-nav"
                initial={{ y: 100, opacity: 0 }}
                animate={{
                    y: isMinimized ? 85 : 20,
                    opacity: 1
                }}
                exit={{ y: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="fixed bottom-0 left-0 right-0 z-5000 px-6 pb-6 pointer-events-none"
            >
                <div className="max-w-5xl mx-auto pointer-events-auto relative">
                    {/* Access Tab / Toggle Button */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                        <motion.button
                            onClick={() => setIsMinimized(!isMinimized)}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-between px-5 w-44 h-7 bg-(--bg-deep) border border-(--bg-hover) rounded-t-lg relative group overflow-hidden shadow-[0_-8px_20px_rgba(0,0,0,0.8)] cursor-pointer"
                        >
                            {/* Technical pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,var(--text-ghost)_50%,transparent_75%)] bg-size-[10px_10px]" />

                            <div className="flex items-center gap-2.5 relative z-10">
                                <motion.div
                                    animate={{
                                        opacity: [1, 0.5, 1],
                                        boxShadow: isMinimized ? "0 0 8px var(--amber)" : "0 0 8px var(--green-base)"
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={`w-1.5 h-1.5 rounded-full ${isMinimized ? 'bg-(--amber)' : 'bg-(--green-base)'}`}
                                />
                                <span className={`text-[10px] font-mono font-black tracking-[0.25em] transition-colors ${isMinimized ? 'text-(--amber)' : 'text-(--green-base)'}`}>
                                    NAVEGACIÓN
                                </span>
                            </div>

                            <motion.div
                                animate={{ rotate: isMinimized ? 180 : 0 }}
                                transition={{ duration: 0.4, ease: "anticipate" }}
                                className="relative z-10"
                            >
                                <ChevronRight
                                    size={12}
                                    className={`${isMinimized ? 'text-(--amber)' : 'text-(--green-base)'} rotate-90 group-hover:text-white transition-colors`}
                                />
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Industrial Chassis */}
                    <motion.div
                        animate={{
                            opacity: isMinimized ? 0.15 : 1,
                            scale: isMinimized ? 0.96 : 1,
                            filter: isMinimized ? 'grayscale(1) brightness(0.4) blur(2px)' : 'none',
                        }}
                        className="relative h-16 bg-(--bg-deep)/95 backdrop-blur-xl border border-(--bg-hover) rounded-sm shadow-[0_-25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                    >
                        {/* Internal Accents / Slots at the edges */}
                        <div className="absolute inset-y-0 left-0 w-1 bg-(--green-base)/20" />
                        <div className="absolute inset-y-0 right-0 w-1 bg-(--green-base)/20" />

                        {/* Metallic / Glass texture */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,var(--text-ghost)_0%,transparent_80%)]" />
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,var(--text-primary)_3px)]" />

                        {/* Top Accent with Running Light effect */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-(--bg-hover)" />
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute top-0 left-0 w-40 h-px bg-linear-to-r from-transparent via-(--green-base)/40 to-transparent"
                        />

                        <div className="relative h-full flex items-center justify-between px-6">
                            {/* Context Action Panel - REGRESAR AL SECTOR (Left) */}
                            <div className="flex items-center min-w-fit md:min-w-[150px] justify-start h-full">
                                {isLevel && actId ? (
                                    <NavButton
                                        href={`/game/${actId}`}
                                        icon={ArrowLeft}
                                        iconPosition="left"
                                        colorTheme="green"
                                    >
                                        RETORNAR AL SECTOR
                                    </NavButton>
                                ) : (
                                    <div className="hidden md:flex flex-col items-start gap-1 pl-4 opacity-10">
                                        <div className="text-[7px] font-mono text-(--text-muted) tracking-[0.4em] uppercase">READY_STBY</div>
                                        <div className="w-16 h-0.5 bg-(--text-ghost)" />
                                    </div>
                                )}
                            </div>


                            {/* Centered Navigation */}
                            <nav className="flex items-center gap-1 sm:gap-12">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/game" && pathname.startsWith(item.href));
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="group relative flex flex-col items-center justify-center w-12 sm:w-28 h-14 transition-all duration-500"
                                        >
                                            {/* Tactical Brackets Selection */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="selection-bracket"
                                                    className="absolute inset-x-0 sm:inset-x-2 inset-y-2 z-0"
                                                >
                                                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: item.color }} />
                                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: item.color }} />
                                                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: item.color }} />
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: item.color }} />

                                                    <div
                                                        className="absolute inset-2 opacity-5 blur-xl rounded-full scale-150"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                </motion.div>
                                            )}

                                            <div className="relative z-10 flex flex-col items-center">
                                                <Icon
                                                    size={isActive ? 22 : 20}
                                                    style={{ color: isActive ? item.color : "var(--text-ghost)" }}
                                                    className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_12px_var(--icon-color)]' : 'group-hover:text-(--text-muted)'}`}
                                                />
                                                <span className={`hidden sm:block text-[8px] sm:text-[9px] font-mono font-black tracking-[0.2em] mt-1.5 transition-colors duration-300 ${isActive ? 'text-(--text-primary)' : 'text-(--text-ghost) group-hover:text-(--text-muted)'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Right Status Panel (Visual Balance) */}
                            <div className="flex items-center min-w-fit md:min-w-[150px] justify-end opacity-20 pr-2">
                                <div className="hidden md:flex items-center gap-3 pr-2">
                                    <div className="flex flex-col gap-0.5 items-end">
                                        <div className="w-8 h-px bg-(--text-muted)" />
                                        <div className="w-12 h-px bg-(--text-muted)" />
                                    </div>
                                    <span className="text-[7px] font-mono text-(--text-muted) tracking-widest uppercase truncate">CORE_V1.5</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.footer>
        </AnimatePresence>
    );
}
