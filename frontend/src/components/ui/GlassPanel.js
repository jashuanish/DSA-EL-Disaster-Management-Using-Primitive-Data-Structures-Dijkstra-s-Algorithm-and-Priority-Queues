import React from 'react';

export default function GlassPanel({ children, className = '', heavy = false, style = {} }) {
    return (
        <div 
            className={`
                backdrop-blur-xl 
                bg-slate-900/40 
                border border-white/5 
                rounded-2xl 
                shadow-2xl 
                ${className}
            `} 
            style={style}
        >
            {children}
        </div>
    );
}
