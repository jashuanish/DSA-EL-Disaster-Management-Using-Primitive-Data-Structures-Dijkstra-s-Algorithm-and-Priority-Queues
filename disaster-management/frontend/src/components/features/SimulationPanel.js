import React, { useState } from 'react';
import GlassPanel from '../ui/GlassPanel';

export default function SimulationPanel({
    simState,
    onSetMode, // 'disaster' | 'shelter' | 'start'
    selectedMode
}) {
    const { isSimulating, algoState, controls, entities } = simState;
    const [tab, setTab] = useState('hazards'); // hazards | logistics

    return (
        <GlassPanel className="absolute top-4 left-4 z-[2000] p-4 w-96 flex flex-col gap-4 animate-slide-in-left" style={{ zIndex: 2000 }}>
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <h2 className="text-lg font-bold text-blue-400 uppercase tracking-widest">SIMULATION MODE</h2>
                <div className="text-[10px] text-slate-500 font-mono tracking-tighter">COMMAND CONSOLE</div>
            </div>

            {/* TABS */}
            <div className="flex gap-1 p-1 bg-slate-900 rounded">
                <button
                    onClick={() => setTab('hazards')}
                    className={`flex-1 text-xs py-2 rounded ${tab === 'hazards' ? 'bg-red-900/50 text-red-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                    ⚠️ HAZARDS
                </button>
                <button
                    onClick={() => setTab('logistics')}
                    className={`flex-1 text-xs py-2 rounded ${tab === 'logistics' ? 'bg-emerald-900/50 text-emerald-200 shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                    🏗️ LOGISTICS
                </button>
            </div>

            {/* PALETTE */}
            {tab === 'hazards' && (
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HAZARD DEPLOYMENT</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => onSetMode('flood')} className={`p-2 rounded border transition-all flex flex-col items-center gap-1 ${selectedMode === 'flood' ? 'bg-blue-600/40 border-blue-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                            <span className="text-lg">🌊</span> <span className="text-[10px] font-mono">HYDRO</span>
                        </button>
                        <button onClick={() => onSetMode('fire')} className={`p-2 rounded border transition-all flex flex-col items-center gap-1 ${selectedMode === 'fire' ? 'bg-red-600/40 border-red-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                            <span className="text-lg">🔥</span> <span className="text-[10px] font-mono">THERMAL</span>
                        </button>
                        <button onClick={() => onSetMode('chemical')} className={`p-2 rounded border transition-all flex flex-col items-center gap-1 ${selectedMode === 'chemical' ? 'bg-emerald-600/40 border-emerald-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                            <span className="text-lg">☣️</span> <span className="text-[10px] font-mono">BIO/CHEM</span>
                        </button>
                    </div>
                </div>
            )}

            {tab === 'logistics' && (
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">OPERATIONAL ASSETS</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onSetMode('start')} className={`p-2 rounded border transition-all flex flex-col items-center gap-1 ${selectedMode === 'start' ? 'bg-blue-600/40 border-blue-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                            <span className="text-lg">📍</span> <span className="text-[10px] font-mono">INSERTION POINT</span>
                        </button>
                        <button onClick={() => onSetMode('shelter')} className={`p-2 rounded border transition-all flex flex-col items-center gap-1 ${selectedMode === 'shelter' ? 'bg-emerald-600/40 border-emerald-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                            <span className="text-lg">🏠</span> <span className="text-[10px] font-mono">SAFE ZONE</span>
                        </button>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                        DESIGNATED ZONES: <span className="text-emerald-400 font-bold">{entities.userShelters.length}</span>
                    </div>
                </div>
            )}

            <div className="text-[10px] text-slate-500 italic text-center mt-1 border-t border-slate-800 pt-1 font-mono">
                {selectedMode ? `SYSTEM ARMED: ${selectedMode.toUpperCase()}` : 'SYSTEM IDLE'}
            </div>

            {/* Algorithm Controls */}
            <div className="flex flex-col gap-2 border-t border-slate-700 pt-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">PROTOCOL CONTROL</label>

                <button onClick={controls.start} disabled={isSimulating} className="btn btn-primary w-full shadow-lg shadow-blue-900/20 text-xs font-bold tracking-widest py-3">
                    ▶ INITIATE ROUTING PROTOCOL
                </button>

                <div className="flex gap-2">
                    <button onClick={isSimulating ? controls.pause : controls.resume} className="btn btn-ghost flex-1 text-[10px] border border-slate-800">
                        {isSimulating ? 'HALT' : 'RESUME'}
                    </button>
                    <button onClick={controls.step} className="btn btn-ghost flex-1 text-[10px] border border-slate-800" disabled={isSimulating}>
                        STEP >
                    </button>
                    <button onClick={controls.reset} className="btn btn-danger flex-1 text-[10px] bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40">
                        ABORT
                    </button>
                </div>

                {/* Algo Status */}
                <div className="bg-black p-3 rounded font-mono text-[10px] text-green-500 border border-green-900/30 h-24 overflow-y-auto custom-scrollbar shadow-inner mt-1">
                    <div className="mb-1 text-green-700 border-b border-green-900/30 pb-1">SYSTEM LOG:</div>
                    <div className="leading-relaxed opacity-90">{algoState.stepDescription}</div>
                </div>

                {/* JOURNEY SIMULATION */}
                {algoState.path.length > 0 && (
                    <button
                        onClick={controls.traversePath}
                        disabled={simState.isNavigating}
                        className={`btn w-full py-2 font-bold flex items-center justify-center gap-2 shadow-lg mt-2 text-xs tracking-wider border ${simState.isNavigating ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800' : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 animate-pulse'}`}
                    >
                        <span>🏃</span> {simState.isNavigating ? 'TRAVERSAL IN PROGRESS...' : 'EXECUTE VISUAL TRAVERSAL'}
                    </button>
                )}

                {/* GOOGLE MAPS EXPORT */}
                {algoState.path.length > 0 && (
                    <button
                        onClick={() => {
                            const nodes = simState.graphData.nodes;
                            const path = algoState.path;
                            if (!nodes || path.length < 2) return;
                            const start = nodes[path[0]];
                            const end = nodes[path[path.length - 1]];
                            const intermediate = path.slice(1, path.length - 1);
                            const step = Math.ceil(intermediate.length / 10);
                            const waypoints = intermediate
                                .filter((_, idx) => idx % step === 0)
                                .map(id => nodes[id])
                                .filter(p => !!p)
                                .map(p => `${p[0]},${p[1]}`)
                                .join('|');
                            const url = `https://www.google.com/maps/dir/?api=1&origin=${start[0]},${start[1]}&destination=${end[0]},${end[1]}&waypoints=${waypoints}&travelmode=walking`;
                            window.open(url, '_blank');
                        }}
                        className="btn bg-blue-800 hover:bg-blue-700 text-white w-full py-2 font-bold flex items-center justify-center gap-2 shadow-lg mt-1 text-xs tracking-wider border border-blue-600"
                    >
                        <span>🗺️</span> EXPORT TO FIELD UNIT (GMAPS)
                    </button>
                )}
            </div>

        </GlassPanel>
    );
}
