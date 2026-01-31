import React from 'react';
import GlassPanel from '../ui/GlassPanel';
import StatusBadge from '../ui/StatusBadge';

export default function LiveMonitor({ alertMsg, riskReduced, zones = [] }) {
    return (
        <GlassPanel className="h-full flex flex-col p-0 overflow-hidden animate-slide-in-left" heavy>
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/40">
                <h2 className="header-title text-xl">LIVE MONITOR</h2>
                <div className="text-xs text-slate-400 font-mono mt-1">STATUS: {alertMsg ? 'CRITICAL' : 'NOMINAL'}</div>
            </div>

            <div className="p-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1">
                {/* ALERT SECTION */}
                <div className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-slate-500 uppercase">Active Alerts</div>
                    {alertMsg ? (
                        <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10 animate-fade-in relative overflow-hidden group">
                            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <StatusBadge type="danger" label="CRITICAL WARNING" pulse />
                                </div>
                                <p className="text-white font-bold text-lg leading-tight">{alertMsg}</p>
                                <p className="text-red-300 text-xs mt-2">Immediate action required. Follow evacuation protocols.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                            <div className="flex items-center gap-3">
                                <StatusBadge type="success" label="SYSTEM NORMAL" />
                            </div>
                            <p className="text-emerald-400/70 text-sm mt-2">No active threats detected in your vicinity.</p>
                        </div>
                    )}
                </div>

                {/* RISK METRICS */}
                {riskReduced && (
                    <div className="flex flex-col gap-2 animate-slide-up delay-100">
                        <div className="text-xs font-bold text-slate-500 uppercase">Risk Analysis</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
                                <div className="text-slate-400 text-xs">Risk Reduction</div>
                                <div className="text-2xl font-bold text-emerald-400">{riskReduced}</div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
                                <div className="text-slate-400 text-xs">Path Confidence</div>
                                <div className="text-2xl font-bold text-blue-400">98%</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ZONES */}
                <div className="flex flex-col gap-2 animate-slide-up delay-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Detected Zones</div>
                    {zones.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {zones.map((z, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-800/30 border border-slate-700 text-sm">
                                    <span className="text-slate-200 capitalize">{z.type} Zone</span>
                                    <span className="text-mono text-xs text-red-400 font-bold">{z.radius}m Radius</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-600 text-sm italic">No active hazard zones mapped.</div>
                    )}
                </div>
            </div>

            <div className="p-3 border-t border-slate-700/50 bg-slate-950/50 text-[10px] text-slate-600 font-mono text-center">
                OFFICIAL DISASTER MANAGEMENT SYSTEM V2.0
            </div>
        </GlassPanel>
    );
}
