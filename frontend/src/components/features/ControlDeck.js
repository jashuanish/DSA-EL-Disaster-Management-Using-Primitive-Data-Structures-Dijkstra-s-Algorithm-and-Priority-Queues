import React from 'react';
import GlassPanel from '../ui/GlassPanel';

export default function ControlDeck({
    scenarios,
    currentScenario,
    setScenario,
    onFindRoute,
    simulate,
    setSimulate,
    hasRoute,
    onOpenGoogleMaps
}) {
    return (
        <GlassPanel className="absolute top-4 left-4 z-[2000] p-5 flex flex-col gap-4 w-80 animate-slide-in-left shadow-2xl" style={{ zIndex: 2000 }}>
             <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Control
                </h2>
                <div className="px-2 py-0.5 rounded bg-slate-800/50 border border-white/5 text-[9px] text-slate-400 font-mono tracking-wider">
                    ONLINE
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scenario</label>
                <div className="relative">
                    <select
                        value={currentScenario}
                        onChange={(e) => setScenario(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 text-white text-xs font-medium rounded-lg p-2.5 outline-none focus:border-blue-500 appearance-none transition-colors"
                        style={{ background: 'rgba(15, 23, 42, 0.6)' }}
                    >
                        {Object.entries(scenarios).map(([key, s]) => (
                            <option key={key} value={key} className="bg-slate-900">
                                {s.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-3 top-3 pointer-events-none text-slate-500 text-[10px]">▼</div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />

            <button 
                onClick={onFindRoute} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
            >
                <span>🔍</span> Find Safe Route
            </button>

            <button
                onClick={() => setSimulate(!simulate)}
                className={`w-full py-3 rounded-lg font-bold text-xs tracking-widest uppercase transition-all border flex items-center justify-center gap-2
                    ${simulate 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
            >
                {simulate ? (
                    <>
                        <span className="animate-pulse">⚠️</span> Sim Active
                    </>
                ) : (
                    <>
                        <span>🟢</span> Sim Standby
                    </>
                )}
            </button>

            {hasRoute && (
                <button
                    onClick={onOpenGoogleMaps}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-[10px] tracking-widest uppercase transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                    <span>🧭</span> Open in Google Maps
                </button>
            )}
        </GlassPanel>
    );
}
