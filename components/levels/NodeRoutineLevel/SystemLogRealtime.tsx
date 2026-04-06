import { Screw } from "@/components/ui/Screw"
import { Terminal } from "lucide-react"

interface SystemLogRealtimeProps {
    id: string
    msg: string
    type: 'info' | 'success' | 'warn' | 'err'

}

export default function SystemLogRealtime({ logs }: { logs: SystemLogRealtimeProps[] }) {
    return (
        <div id="system-logs" className="flex-1 flex flex-col overflow-hidden min-h-[200px] shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] relative group/console">

            {/* 2. PANTALLA: El "Void" donde vive el texto emisivo */}
            <div className="flex-1 p-3 flex flex-col-reverse gap-1.5 overflow-y-auto custom-scrollbar 
                                            font-mono text-[10px] leading-tight relative z-10 bg-(--bg-deep) 
                                            shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">

                {/* Scanlines industriales */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-size-[100%_4px] opacity-20 z-20" />

                {logs.map(log => (
                    <div
                        key={log.id}
                        className={`flex gap-2 text-xs animate-in slide-in-from-left-1 fade-in duration-200 relative z-30
                                            ${log.type === 'err' ? 'text-(--red) drop-shadow-[0_0_5px_rgba(226,75,74,0.3)]'
                                : log.type === 'warn' ? 'text-(--amber) drop-shadow-[0_0_5px_rgba(239,159,39,0.3)]'
                                    : log.type === 'success' ? 'text-(--green-light) drop-shadow-[0_0_5px_rgba(126,213,38,0.3)]'
                                        : 'text-(--text-muted)'}`}
                    >
                        <span className="opacity-20 shrink-0 select-none text-(--text-primary)">»</span>
                        <span className="wrap-break-words tracking-tight font-medium">
                            {log.msg}
                        </span>
                    </div>
                ))}
            </div>

            {/* 3. FOOTER: Telemetría Activa (Integrada al chasis) */}
            <div className="bg-(--bg-void) p-2 px-3 border-t border-(--border-muted-color) flex justify-between items-center relative z-20">
                <div className="flex items-center gap-2">
                    {/* LED Verde Ácido con Glow real */}
                    <div className="w-1.5 h-1.5 bg-(--green-light) rounded-full shadow-[0_0_8px_var(--green-base)] animate-pulse" />
                    <span className="text-[9px] text-(--text-muted)/85 pt-0.5 font-mono font-black uppercase tracking-[0.15em]">
                        Live_Telemetry_Feed_Active
                    </span>
                </div>

                {/* Detalle técnico de esquina */}
                <span className="text-[9px] font-mono text-(--text-muted)">L-ID: 0x2157</span>
            </div>

        </div>
    )
}