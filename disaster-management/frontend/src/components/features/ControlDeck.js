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
        <GlassPanel className="absolute top-4 left-4 z-[2000] p-4 flex flex-col gap-3 w-80 animate-slide-in-left" style={{ zIndex: 2000 }}>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operational Scenario</label>
                <select
                    value={currentScenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-sm rounded-md p-2 outline-none focus:border-blue-500 transition-colors"
                    style={{ background: 'rgba(15, 23, 42, 0.8)', color: 'white' }}
                >
                    {Object.entries(scenarios).map(([key, s]) => (
                        <option key={key} value={key}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-px bg-slate-700/50 my-1" />

            <button onClick={onFindRoute} className="btn btn-primary w-full shadow-lg">
                <span>🔍</span> Find Safe Route
            </button>

            <button
                onClick={() => setSimulate(!simulate)}
                className={`btn w-full transition-all ${simulate ? 'btn-danger' : 'btn-success'}`}
            >
                {simulate ? (
                    <>
                        <span className="animate-pulse">⚠️</span> Simulation STATUS: ACTIVE
                    </>
                ) : (
                    <>
                        <span>🟢</span> Simulation STATUS: OFF
                    </>
                )}
            </button>

            {hasRoute && (
                <button
                    onClick={onOpenGoogleMaps}
                    className="btn btn-ghost w-full text-xs mt-2"
                >
                    <span>🧭</span> Open in Google Maps
                </button>
            )}
        </GlassPanel>
    );
}
