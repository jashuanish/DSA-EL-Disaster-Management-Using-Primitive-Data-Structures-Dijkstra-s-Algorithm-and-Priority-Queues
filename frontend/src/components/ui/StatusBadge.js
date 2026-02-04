import React from 'react';

export default function StatusBadge({ type = 'normal', label, pulse = false }) {
    // type: 'normal' | 'success' | 'danger' | 'warning'
    const colorMap = {
        normal: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        danger: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    };

    const dotColor = {
        normal: 'bg-slate-400',
        success: 'bg-emerald-400',
        danger: 'bg-rose-400',
        warning: 'bg-amber-400'
    };

    const baseClass = `
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
        border text-[10px] font-bold uppercase tracking-wider
        backdrop-blur-sm transition-all duration-300
    `;

    return (
        <div className={`${baseClass} ${colorMap[type]} ${pulse ? 'animate-pulse' : ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[type]} shadow-[0_0_8px_currentColor]`} />
            {label}
        </div>
    );
}
