import React from 'react';
import GlassPanel from '../ui/GlassPanel';
import StatusBadge from '../ui/StatusBadge';

export default function LiveMonitor({ alertMsg, riskReduced, zones = [], weather }) {
    return (
        <GlassPanel className="h-full flex flex-col p-4 overflow-hidden animate-slide-in-left">
            <div className="flex flex-col gap-1 mb-6 border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    Live Monitor
                </h2>
                <div className="text-[10px] font-medium tracking-widest text-slate-500 uppercase">System Status: {alertMsg ? 'Active Threat' : 'Nominal'}</div>
            </div>

            <div className="flex flex-col gap-8 overflow-y-auto custom-scrollbar flex-1 pr-2">
                {/* ALERT SECTION */}
                <div className="flex flex-col gap-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Alerts</div>
                    {alertMsg ? (
                        <div className="p-5 rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <StatusBadge type="danger" label="CRITICAL WARNING" pulse />
                                <h3 className="text-white font-bold text-lg leading-tight mt-3">{alertMsg}</h3>
                                <p className="text-red-200/60 text-xs mt-2 font-medium">Immediate action required. Follow evacuation protocols.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
                            <StatusBadge type="success" label="SYSTEM NORMAL" />
                            <p className="text-emerald-400/60 text-sm mt-3 font-medium">No active threats detected in your sector.</p>
                        </div>
                    )}
                </div>

                {/* WEATHER CONDITIONS */}
                {weather && (
                    <div className="flex flex-col gap-3 animate-slide-up">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Conditions</div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center transition hover:bg-slate-800/60">
                                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-1">Temp</div>
                                <div className="text-xl font-bold text-white">{Math.round(weather.temp)}°</div>
                            </div>
                            <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center transition hover:bg-slate-800/60">
                                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-1">Wind</div>
                                <div className="text-xl font-bold text-white flex justify-center items-end gap-0.5">
                                    {Math.round(weather.wind)}<span className="text-[10px] text-slate-500 mb-1">km/h</span>
                                </div>
                            </div>
                            <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 text-center transition hover:bg-slate-800/60">
                                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-1">Rain</div>
                                <div className="text-xl font-bold text-sky-400">{weather.rain}<span className="text-[10px] text-sky-500/60 ml-0.5">mm</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* RISK METRICS */}
                {riskReduced && (
                    <div className="flex flex-col gap-3 animate-slide-up delay-100">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analytics</div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                <div className="text-emerald-400/60 text-[10px] uppercase font-bold mb-1">Risk Reduction</div>
                                <div className="text-2xl font-bold text-emerald-400">{riskReduced}</div>
                            </div>
                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                <div className="text-blue-400/60 text-[10px] uppercase font-bold mb-1">Confidence</div>
                                <div className="text-2xl font-bold text-blue-400">98%</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ZONES */}
                <div className="flex flex-col gap-3 animate-slide-up delay-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detected Zones</div>
                    {zones.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {zones.map((z, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-white/5 text-sm hover:border-white/10 transition">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${z.type === 'flood' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                        <span className="text-slate-300 capitalize font-medium">{z.type} Zone</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded">{z.radius}m</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm italic py-2 text-center">No active hazard zones mapped.</div>
                    )}
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-slate-600 uppercase tracking-widest text-center">
                Disaster Management OS v2.4
            </div>
        </GlassPanel>
    );
}
