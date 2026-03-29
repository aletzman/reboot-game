"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Map, Package, LayoutGrid, Box, ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/game", label: "MAPA_SIS", icon: Map, color: "var(--green-light)" },
    { href: "/game/collection", label: "ALMACÉN", icon: Package, color: "var(--cyan)" },
    { href: "/game/collection/cards", label: "CARTAS", icon: LayoutGrid, color: "var(--amber)" },
    { href: "/game/collection/objects", label: "OBJETOS", icon: Box, color: "var(--blue)" },
];

export function NavigationFooter() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || pathname === "/") return null;

    // Detect if we are in a level
    const isLevel = pathname.includes("/level/");

    // Extract sector from path: /game/[actId]/level/[id]
    // or /game/[actId]
    const pathParts = pathname.split("/");
    const actId = pathParts.length > 2 && pathParts[1] === "game" ? pathParts[2] : null;

    return (
        <AnimatePresence mode="wait">
            <motion.footer
                key="footer-nav"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="fixed bottom-0 left-0 right-0 z-5000 h-14 bg-(--bg-surface)/90 backdrop-blur-md border-t border-(--bg-hover) px-4 flex items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
            >
                {/* Visual accents */}
                <div className="absolute top-0 left-0 w-8 h-px bg-(--green-base) opacity-50" />
                <div className="absolute top-0 right-0 w-8 h-px bg-(--green-base) opacity-50" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-(--bg-hover) rounded-full opacity-20" />

                <div className="max-w-7xl mx-auto w-full flex items-center justify-around md:justify-center md:gap-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/game" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href} className="group relative flex flex-col items-center py-1">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <Icon
                                        size={18}
                                        style={{ color: isActive ? item.color : "var(--text-ghost)" }}
                                        className={`transition-colors duration-300 ${isActive ? '' : 'group-hover:text-(--text-muted)'}`}
                                    />
                                    <span className={`text-[9px] font-mono font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${isActive ? 'text-(--text-primary)' : 'text-(--text-ghost) group-hover:text-(--text-muted)'}`}>
                                        {item.label}
                                    </span>
                                </motion.div>

                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -top-px left-0 right-0 h-[2px]"
                                        style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {/* Dynamic Context Link: Back to Sector Levels */}
                    {isLevel && actId && (
                        <div className="flex items-center gap-2 border-l border-(--bg-hover) md:pl-8 md:ml-4 h-8 pl-4 ml-2">
                            <Link
                                href={`/game/${actId}`}
                                className="group flex items-center gap-2 px-2 py-1 bg-(--bg-void) border border-(--purple)/30 hover:border-(--purple) transition-all rounded-sm"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-(--purple) animate-pulse shadow-[0_0_8px_var(--purple)]" />
                                <div className="flex flex-col">
                                    <span className="text-[7.5px] font-mono font-bold text-(--purple) uppercase tracking-tighter leading-tight">
                                        SECTOR_SINC
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-(--text-primary) uppercase tracking-tighter leading-tight">
                                        NIVELES_{actId?.split('-').pop()?.toUpperCase() || 'ACT'}
                                    </span>
                                </div>
                                <ChevronRight size={12} className="text-(--purple) group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Industrial decorative elements */}
                <div className="absolute right-4 bottom-2 hidden lg:flex items-center gap-3 opacity-20 pointer-events-none">
                    <div className="flex flex-col gap-0.5">
                        <div className="w-12 h-px bg-(--text-ghost)" />
                        <div className="w-8 h-px bg-(--text-ghost) ml-auto" />
                    </div>
                    <span className="text-[7px] font-mono text-(--text-ghost)">RBT_NAV_MDL</span>
                </div>
            </motion.footer>
        </AnimatePresence>
    );
}
