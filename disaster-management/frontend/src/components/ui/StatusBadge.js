import React from 'react';

export default function StatusBadge({ type = 'normal', label, pulse = false }) {
    // type: 'normal' | 'success' | 'danger' | 'warning'
    const colorMap = {
        normal: 'var(--text-muted)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)'
    };

    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '20px',
        background: `rgba(0, 0, 0, 0.3)`,
        border: `1px solid ${colorMap[type]}`,
        color: colorMap[type],
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        backdropFilter: 'blur(4px)'
    };

    return (
        <div style={style} className={pulse ? 'pulse-danger' : ''}>
            <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: colorMap[type],
                boxShadow: `0 0 8px ${colorMap[type]}`
            }} />
            {label}
        </div>
    );
}
