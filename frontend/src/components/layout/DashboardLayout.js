import React from 'react';

export default function DashboardLayout({ children }) {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            background: '#0f172a', /* Fallback */
            position: 'relative',
            overflow: 'hidden'
        }} className="animate-fade-in">
            {/* Modern Deep Gradient Background */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%)',
                zIndex: -1
            }} />

            {children}
        </div>
    );
}
