"use client"

import { Loader2, Terminal, Cpu, Database, Network, Search, Archive, CpuIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDialogues } from '@/services/dialoguesService'

type LoadingVariant = 'system' | 'frag' | 'danger' | 'amber'

interface LoadingProps {
	message?: string
	subtext?: string
	variant?: LoadingVariant
	fullScreen?: boolean
	showTips?: boolean
	icon?: 'loader' | 'terminal' | 'cpu' | 'database' | 'network' | 'archive' | 'search'
}

const icons = {
	loader: Loader2,
	terminal: Terminal,
	cpu: CpuIcon,
	database: Database,
	network: Network,
	archive: Archive,
	search: Search,
}

export function Loading({
	message = 'REESTABLECIENDO_SISTEMAS...',
	subtext,
	variant = 'system',
	fullScreen = true,
	showTips = false,
	icon = 'loader'
}: LoadingProps) {
	const [tip, setTip] = useState<string>('')
	const [rotation, setRotation] = useState(0)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		if (showTips) {
			getDialogues().then(data => {
				const tips = data.frag.ambient_tips
				const randomTip = tips[Math.floor(Math.random() * tips.length)]
				setTip(randomTip)
			}).catch(console.error)
		}

		const interval = setInterval(() => {
			setRotation(prev => (prev + 1) % 360)
			setProgress(prev => (prev + 1) % 100)
		}, 20)

		return () => clearInterval(interval)
	}, [showTips])

	const colorHex =
		variant === 'frag' ? 'var(--purple)' :
			variant === 'danger' ? 'var(--red)' :
				variant === 'amber' ? 'var(--amber)' :
					'var(--green-light)'

	const accentColor =
		variant === 'frag' ? 'var(--purple)' :
			variant === 'danger' ? 'var(--red)' :
				variant === 'amber' ? 'var(--amber)' :
					'var(--green-base)'

	const IconComponent = icons[icon]

	return (
		<div className={`flex flex-col items-center justify-center font-mono overflow-hidden ${fullScreen ? 'relative inset-0 min-h-screen z-9999' : 'w-full min-h-[500px] h-full relative'}`}>

			{/* ── AMBIENT DATA STREAMS (Background) ── */}
			<div className="absolute inset-0 opacity-10 pointer-events-none select-none">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="absolute text-[10px] whitespace-nowrap animate-slide-down"
						style={{
							left: `${(i + 1) * 15}%`,
							animationDuration: `${15 + i * 5}s`,
							color: colorHex,
							opacity: 0.2 + (i % 3) * 0.2
						}}
					>
						{[...Array(20)].map(() => Math.floor(Math.random() * 16).toString(16)).join(' ')}
					</div>
				))}
			</div>

			{/* ── THE CORE (Central Cluster) ── */}
			<div className="relative z-10 flex flex-col items-center">

				{/* Animated Rings & Icon */}
				<div className="relative w-48 h-48 flex items-center justify-center">
					{/* Outer Rotating Ring */}
					<div
						className="absolute inset-0 border border-dashed rounded-full opacity-20"
						style={{
							borderColor: colorHex,
							transform: `rotate(${rotation}deg)`,
							borderWidth: '2px'
						}}
					/>

					{/* Inner Pulsing Ring */}
					<div
						className="absolute inset-4 border border-current rounded-full opacity-10 animate-ping"
						style={{ color: colorHex }}
					/>

					{/* Glassmorphic Decagon Background */}
					<div className="absolute inset-8 bg-(--bg-surface)/40 backdrop-blur-xl border border-white/10 rounded-2xl rotate-45 group-hover:rotate-90 transition-transform duration-1000 shadow-2xl" />

					{/* The Icon Core */}
					<div className="relative p-8 bg-(--bg-deep) border-2 border-white/5 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20">
						<IconComponent
							className={`w-14 h-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
							style={{ color: colorHex }}
						/>
						{/* Spinning micro-loader over icon */}
						<div className="absolute -inset-1 border-t-2 border-current rounded-full animate-spin opacity-40" style={{ color: colorHex }} />
					</div>

					{/* Orbiting Tech Bits */}
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="absolute w-2 h-2 rounded-full"
							style={{
								backgroundColor: colorHex,
								boxShadow: `0 0 10px ${colorHex}`,
								top: '50%',
								left: '50%',
								transform: `rotate(${rotation * (i % 2 ? 1 : -1) + i * 90}deg) translate(80px)`
							}}
						/>
					))}
				</div>

				{/* ── CONTENT (Message & Progress) ── */}
				<div className="mt-12 flex flex-col items-center gap-6 text-center">

					{/* Glitchy Heading */}
					<div className="relative">
						<h2
							className="text-3xl font-black uppercase tracking-tighter text-white animate-pulse"
							style={{ textShadow: `0 0 15px ${colorHex}55` }}
						>
							{message}
						</h2>
					</div>

					{/* High-Fidelity Progress Segment */}
					<div className="flex flex-col gap-2 w-64">
						<div className="flex justify-between items-end px-1">
							<span className="text-[10px] text-(--text-muted) tracking-widest font-black uppercase">Sync_Status</span>
							<span className={`text-[12px] font-mono font-bold animate-pulse`} style={{ color: colorHex }}>
								ONLINE
							</span>
						</div>
						<div className="h-2 bg-[#0a0f14] border border-white/5 p-0.5 rounded-xs overflow-hidden flex gap-1 items-center">
							{[...Array(12)].map((_, i) => {
								const isFilled = (i / 12) * 100 < progress;
								const isCurrent = Math.floor((progress / 100) * 12) === i;

								return (
									<div
										key={i}
										className={`flex-1 h-full transition-all duration-300 ${isFilled ? 'opacity-100 shadow-[0_0_8px_currentColor] brightness-125' : 'opacity-10'} ${isCurrent ? 'animate-pulse' : ''}`}
										style={{
											backgroundColor: colorHex,
										}}
									/>
								)
							})}
						</div>
					</div>

					{/* Tips / Dialogues */}
					{tip && (
						<div className="relative mt-2 p-4 bg-white/5 border-l-2 backdrop-blur-sm" style={{ borderLeftColor: colorHex }}>
							<p className="text-[12px] text-(--text-muted) italic max-w-sm leading-relaxed font-sans opacity-80">
								"{tip}"
							</p>
						</div>
					)}
				</div>
			</div>

			{/* ── FOOTER TECHNICAL DATA ── */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: colorHex }}>
				<span>V2.4_FINAL_BUILD</span>
				<span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
				<span>LINK_SECURE::TRUE</span>
			</div>

			<style jsx global>{`
        @keyframes slide-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes segment-pulse {
          0%, 100% { opacity: 0.1; transform: scaleY(0.8); }
          50% { opacity: 0.6; transform: scaleY(1); box-shadow: 0 0 5px currentColor; }
        }
        .animate-slide-down {
          animation: slide-down 20s linear infinite;
        }
      `}</style>
		</div>
	)
}
