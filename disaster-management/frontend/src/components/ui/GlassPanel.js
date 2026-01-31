import React from 'react';

export default function GlassPanel({ children, className = '', heavy = false, style = {} }) {
    return (
        <div className={`glass-panel ${heavy ? 'glass-panel-heavy' : ''} ${className}`} style={style}>
            {children}
        </div>
    );
}
