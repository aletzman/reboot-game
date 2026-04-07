"use client";

import { usePathname } from "next/navigation";
import { Map, ChevronRight, Binary, Cpu, ArrowLeft, ShelvingUnit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

import { NavButton } from "./NavButton";

const navItems = [
    {
        href: "/game",
        label: "SECTORES",
        icon: Map,
        color: "cyan",
        tag: "0x01_MAP"
    },
    {
        href: "/game/collection",
        label: "ALMACÉN",
        icon: ShelvingUnit,
        color: "purple",
        tag: "0x02_DB"
    },
    {
        href: "/game/collection/cards",
        label: "MÓDULOS",
        icon: Binary,
        color: "blue",
        tag: "0x03_MOD"
    },
    {
        href: "/game/collection/objects",
        label: "OBJETOS",
        icon: Cpu,
        color: "amber",
        tag: "0x04_OBJ"
    },
];

export function NavigationFooter() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const isLevel = pathname.includes("/level/");
    useEffect(() => {
        setMounted(true);
        if (isLevel) {
            setIsMinimized(true);
        }
    }, [isLevel]);

    if (!mounted || pathname === "/") return null;

    const pathParts = pathname.split("/");
    const actId = pathParts.length > 2 && pathParts[1] === "game" ? pathParts[2] : null;

    return (
        <AnimatePresence mode="wait">
            <motion.footer
                key="footer-nav"
                initial={{ y: 100, opacity: 0 }}
                animate={{
                    y: isMinimized ? 87 : 10,
                    opacity: 1
                }}
                exit={{ y: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="fixed bottom-0 left-0 right-0 z-5000 pb-2 pointer-events-none"
            >
                <div className="max-w-5xl mx-auto pointer-events-auto relative">

                    {/* Access Tab / Toggle Button */}
                    <div className="absolute -top-[34px] left-1/2 -translate-x-1/2 z-20">
                        <div className="w-[204px] h-[8px] bg-(--bg-void) absolute bottom-0 left-1/2 -translate-x-1/2 border-x border-t border-(--bg-void) rounded-t-[2px] z-0 shadow-[inset_0_4px_8px_rgba(0,0,0,1)] pointer-events-none" />
                        <motion.button
                            onClick={() => setIsMinimized(!isMinimized)}
                            whileHover={{ y: 2 }}
                            whileTap={{ y: 6, transition: { duration: 0.1 } }}
                            className="flex items-center justify-between px-5 w-48 h-9 bg-[linear-gradient(180deg,#161b22,#0a0d11)] border-t-2 border-x-2 border-[#1c2229] rounded-t-[4px] relative group overflow-hidden shadow-[0_-8px_20px_rgba(0,0,0,0.8),inset_0_2px_2px_rgba(255,255,255,0.05)] cursor-pointer z-10"
                        >
                            <div className="absolute inset-[4px] border border-black/60 rounded-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] pointer-events-none" />
                            <div className="absolute left-[4px] right-[4px] top-[4px] bottom-[4px] rounded-sm opacity-[0.08] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[4px_4px] pointer-events-none" />

                            <div className="flex items-center gap-2.5 relative z-10">
                                <motion.div
                                    animate={{
                                        opacity: [1, 0.4, 1],
                                        boxShadow: isMinimized ? "0 0 8px var(--amber)" : "0 0 8px var(--green-base)"
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={`w-2 h-2 rounded-[1px] ${isMinimized ? 'bg-[#ef9f27]' : 'bg-[#2d7800]'}`}
                                />
                                <span className={`text-[10px] font-mono font-black tracking-[0.25em] transition-colors ${isMinimized ? 'text-[#ef9f27] drop-shadow-[0_0_4px_var(--amber)]' : 'text-[#E6EDF3] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'}`}>
                                    NAVEGACIÓN
                                </span>
                            </div>

                            <motion.div
                                animate={{ rotate: isMinimized ? 180 : 0 }}
                                transition={{ duration: 0.4, ease: "anticipate" }}
                                className="relative z-10 border border-(--bg-void) bg-(--bg-void) p-0.5 rounded-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,1)]"
                            >
                                <ChevronRight
                                    size={14}
                                    strokeWidth={3}
                                    className={`${isMinimized ? 'text-[#ef9f27]' : 'text-[#2d7800]'} rotate-90 transition-colors drop-shadow-[0_0_4px_currentColor]`}
                                />
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Chassis */}
                    <motion.div
                        animate={{
                            opacity: isMinimized ? 0.3 : 1,
                            scale: isMinimized ? 0.96 : 1,
                            filter: isMinimized ? 'grayscale(1) brightness(0.4) blur(1px)' : 'none',
                        }}
                        className="relative h-20 bg-(--bg-void) rounded-[6px] p-[6px] border border-black shadow-[0_-25px_60px_rgba(0,0,0,0.9),inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)] overflow-visible"
                    >
                        <div className="relative h-full w-full bg-[linear-gradient(45deg,color-mix(in_srgb,var(--bg-hover)_60%,transparent_100%),color-mix(in_srgb,var(--bg-surface)_60%,transparent_100%)_55%)] bg-size-[3px_3px] rounded-[3px] border-2 border-[#1c2229] shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.05)] overflow-hidden flex items-center justify-between px-2 sm:px-6">

                            <div className="absolute inset-y-0 left-0 w-2.5 bg-(--bg-void) border-r border-(--bg-void) shadow-[inset_0_2px_8px_rgba(0,0,0,1)] flex flex-col items-center justify-evenly py-2 pointer-events-none z-0">
                                <div className="w-px h-3 bg-[#1c2229]" />
                                <div className="w-px h-3 bg-[#1c2229]" />
                            </div>
                            <div className="absolute inset-y-0 right-0 w-2.5 bg-(--bg-void) border-l border-(--bg-void) shadow-[inset_0_2px_8px_rgba(0,0,0,1)] flex flex-col items-center justify-evenly py-2 pointer-events-none z-0">
                                <div className="w-px h-3 bg-[#1c2229]" />
                                <div className="w-px h-3 bg-[#1c2229]" />
                            </div>

                            {/* Centered Navigation */}
                            <nav className="flex items-center justify-center w-full gap-1 sm:gap-2 relative z-10 px-2 h-full py-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/game" && pathname.startsWith(item.href));

                                    return (
                                        <NavButton
                                            key={item.href}
                                            href={item.href}
                                            icon={item.icon}
                                            isActive={isActive}
                                            colorTheme={item.color as any}
                                            tag={item.tag}
                                        >
                                            {item.label}
                                        </NavButton>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.div>
                </div>
            </motion.footer>
        </AnimatePresence>
    );
}

