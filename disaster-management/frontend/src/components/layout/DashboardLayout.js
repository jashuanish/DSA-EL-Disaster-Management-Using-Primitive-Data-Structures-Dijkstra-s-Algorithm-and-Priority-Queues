import React from 'react';

export default function DashboardLayout({ children }) {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            background: 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 70%)',
            position: 'relative',
            overflow: 'hidden'
        }} className="animate-fade-in">
            {/* Decorative faint grid */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                opacity: 0.5
            }} />

            {children}
        </div>
    );
}
