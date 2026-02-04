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
        <GlassPanel className="absolute top-4 left-4 z-[2000] p-5 w-96 flex flex-col gap-5 animate-slide-in-left shadow-2xl" style={{ zIndex: 2000 }}>
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Sim Control
                </h2>
                <div className="px-2 py-0.5 rounded bg-slate-800/50 border border-white/5 text-[9px] text-slate-400 font-mono tracking-wider">
                    CONSOLE ACTIVE
                </div>
            </div>

            {/* TABS */}
            <div className="flex gap-1 p-1 bg-slate-950/50 rounded-lg border border-white/5">
                <button
                    onClick={() => setTab('hazards')}
                    className={`flex-1 text-[10px] font-bold py-2 rounded-md transition-all uppercase tracking-wide ${tab === 'hazards' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    ⚠️ Hazards
                </button>
                <button
                    onClick={() => setTab('logistics')}
                    className={`flex-1 text-[10px] font-bold py-2 rounded-md transition-all uppercase tracking-wide ${tab === 'logistics' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    🏗️ Logistics
                </button>
            </div>

            {/* PALETTE */}
            {tab === 'hazards' && (
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hazard Deployment</label>
                    <div className="grid grid-cols-3 gap-2">
                        <PaletteButton 
                            active={selectedMode === 'flood'} 
                            onClick={() => onSetMode('flood')} 
                            icon="🌊" 
                            label="Hydro" 
                            color="blue"
                        />
                        <PaletteButton 
                            active={selectedMode === 'fire'} 
                            onClick={() => onSetMode('fire')} 
                            icon="🔥" 
                            label="Thermal" 
                            color="red"
                        />
                        <PaletteButton 
                            active={selectedMode === 'chemical'} 
                            onClick={() => onSetMode('chemical')} 
                            icon="☣️" 
                            label="Bio/Chem" 
                            color="emerald"
                        />
                    </div>
                </div>
            )}

            {tab === 'logistics' && (
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assets</label>
                    <div className="grid grid-cols-2 gap-2">
                        <PaletteButton 
                            active={selectedMode === 'start'} 
                            onClick={() => onSetMode('start')} 
                            icon="📍" 
                            label="Insertion Point" 
                            color="blue"
                        />
                        <PaletteButton 
                            active={selectedMode === 'shelter'} 
                            onClick={() => onSetMode('shelter')} 
                            icon="🏠" 
                            label="Safe Zone" 
                            color="emerald"
                        />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex justify-between px-1">
                        <span>Active Zones</span>
                        <span className="text-white font-mono">{entities.userShelters.length}</span>
                    </div>
                </div>
            )}

            <div className="text-[10px] text-slate-600 text-center font-mono py-1">
                {selectedMode ? `// SYSTEM ARMED: ${selectedMode.toUpperCase()}` : '// STANDBY'}
            </div>

            {/* Algorithm Controls */}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Control</label>

                <button 
                    onClick={controls.start} 
                    disabled={isSimulating} 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-blue-500/20 disabled:shadow-none"
                >
                    ▶ Initiate Routing
                </button>

                <div className="flex gap-2">
                    <ControlButton onClick={isSimulating ? controls.pause : controls.resume} label={isSimulating ? 'Pause' : 'Resume'} />
                    <ControlButton onClick={controls.step} label="Step >" disabled={isSimulating} />
                    <ControlButton onClick={controls.reset} label="Abort" danger />
                </div>

                {/* Algo Status */}
                <div className="bg-slate-950/80 p-3 rounded-lg font-mono text-[10px] text-emerald-400 border border-white/5 h-24 overflow-y-auto custom-scrollbar shadow-inner mt-1">
                    <div className="mb-2 text-slate-500 border-b border-white/5 pb-1 flex justify-between">
                        <span>SYS_LOG</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="leading-relaxed opacity-90 font-medium">{algoState.stepDescription}</div>
                </div>

                {/* ACTION BUTTONS */}
                {algoState.path.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-2">
                         <button
                            onClick={controls.traversePath}
                            disabled={simState.isNavigating}
                            className={`w-full py-2 rounded-lg font-bold text-[10px] tracking-wider uppercase border transition-all flex items-center justify-center gap-2
                                ${simState.isNavigating 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                                }`}
                        >
                            <span>🏃</span> {simState.isNavigating ? 'Traversal Active' : 'Visual Traversal'}
                        </button>

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
                            className="w-full py-2 rounded-lg font-bold text-[10px] tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <span>🗺️</span> Export Route
                        </button>
                    </div>
                )}
            </div>

        </GlassPanel>
    );
}

function PaletteButton({ active, onClick, icon, label, color }) {
    const colorClasses = {
        blue: active ? 'bg-blue-500/20 border-blue-500 text-white' : 'hover:border-blue-500/50 hover:bg-blue-500/10',
        red: active ? 'bg-red-500/20 border-red-500 text-white' : 'hover:border-red-500/50 hover:bg-red-500/10',
        emerald: active ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'hover:border-emerald-500/50 hover:bg-emerald-500/10'
    };
    
    // Default fallback
    const baseClass = active 
        ? colorClasses[color] 
        : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-slate-200';

    return (
        <button 
            onClick={onClick} 
            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${baseClass}`}
        >
            <span className="text-xl filter drop-shadow-md">{icon}</span> 
            <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
        </button>
    );
}

function ControlButton({ onClick, label, disabled, danger }) {
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={`
                flex-1 py-2 rounded-lg font-bold text-[10px] tracking-wide uppercase transition-all
                ${danger 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {label}
        </button>
    );
}
