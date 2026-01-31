import React, { useRef, useEffect } from 'react';
import GlassPanel from '../ui/GlassPanel';

export default function RouteGuide({ directions = [], riskReduced }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [directions]);

    if (!directions || directions.length === 0) {
        return (
            <GlassPanel className="h-full p-6 flex flex-col items-center justify-center text-center animate-slide-in-right" heavy>
                <div className="text-6xl mb-4 opacity-20">🗺️</div>
                <h3 className="text-slate-400 font-bold text-lg">No Route Active</h3>
                <p className="text-slate-500 text-sm max-w-[200px] mt-2">Select a destination or enable simulation to generate a safe evacuation path.</p>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="h-full flex flex-col overflow-hidden animate-slide-in-right" heavy>
            <div className="p-4 border-b border-slate-700/50 bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <h2 className="header-title text-lg text-blue-100">NAVIGATION</h2>
                    <div className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold font-mono">
                        SAFEST ROUTE
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={scrollRef}>
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-slate-700/50" />

                    {directions.map((step, idx) => (
                        <div key={idx} className="relative pl-8 mb-6 last:mb-0 group animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            {/* Dot */}
                            <div className="absolute left-[8px] top-[6px] w-[11px] h-[11px] rounded-full bg-slate-800 border-2 border-slate-500 group-hover:border-blue-400 group-hover:bg-blue-500 transition-colors z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

                            <div className="text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 group-hover:border-blue-500/30 transition-colors">
                                {step}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {riskReduced && (
                <div className="p-4 bg-emerald-900/20 border-t border-emerald-500/20">
                    <div className="flex items-center gap-3">
                        <div className="text-emerald-400 text-2xl">🛡️</div>
                        <div>
                            <div className="text-xs text-emerald-300 uppercase font-bold">Safety Guarantee</div>
                            <div className="text-emerald-100 text-sm">Risk reduced by <span className="font-bold text-emerald-400">{riskReduced}</span> via this route.</div>
                        </div>
                    </div>
                </div>
            )}
        </GlassPanel>
    );
}
