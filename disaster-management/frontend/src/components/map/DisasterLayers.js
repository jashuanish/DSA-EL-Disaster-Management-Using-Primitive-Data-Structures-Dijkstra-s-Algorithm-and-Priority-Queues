import React from 'react';
import { Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function DisasterLayers({ disasters }) {
    return (
        <>
            {disasters.map(d => {
                if (d.type === 'flood') {
                    return (
                        <React.Fragment key={d.id}>
                            {/* Inner Water Body */}
                            <Circle
                                center={d.position}
                                radius={d.radius}
                                pathOptions={{ fillColor: '#3b82f6', color: 'transparent', fillOpacity: 0.6 }}
                            />
                            {/* Animated Ripple (Approximated with concentric circles for now) */}
                            <Circle
                                center={d.position}
                                radius={d.radius * 1.2}
                                pathOptions={{ fillColor: '#60a5fa', color: 'transparent', fillOpacity: 0.3 }}
                                className="animate-pulse" // Requires custom CSS support for SVG elements usually
                            />
                            <Marker position={d.position} icon={iconMap.flood}>
                                <Popup>🌊 Flood Zone (High Water Level)</Popup>
                            </Marker>
                        </React.Fragment>
                    );
                }
                if (d.type === 'fire') {
                    return (
                        <React.Fragment key={d.id}>
                            <Circle
                                center={d.position}
                                radius={d.radius}
                                pathOptions={{ fillColor: '#ef4444', color: '#b91c1c', fillOpacity: 0.5 }}
                            />
                            <Marker position={d.position} icon={iconMap.fire}>
                                <Popup>🔥 Active Fire (Heat Radiation)</Popup>
                            </Marker>
                        </React.Fragment>
                    )
                }
                if (d.type === 'chemical') {
                    return (
                        <React.Fragment key={d.id}>
                            <Circle
                                center={d.position}
                                radius={d.radius + 100}
                                pathOptions={{ fillColor: '#10b981', color: 'transparent', fillOpacity: 0.4 }}
                            />
                            <Marker position={d.position} icon={iconMap.chemical} >
                                <Popup>☣️ Chemical Hazard (Toxic Air)</Popup>
                            </Marker>
                        </React.Fragment>
                    )
                }
                return null;
            })}
        </>
    );
}

// Icons
const iconMap = {
    flood: new L.DivIcon({
        className: 'custom-icon',
        html: '<div style="font-size: 24px;">🌊</div>'
    }),
    fire: new L.DivIcon({
        className: 'custom-icon',
        html: '<div style="font-size: 24px;">🔥</div>'
    }),
    chemical: new L.DivIcon({
        className: 'custom-icon',
        html: '<div style="font-size: 24px;">☣️</div>'
    })
};
