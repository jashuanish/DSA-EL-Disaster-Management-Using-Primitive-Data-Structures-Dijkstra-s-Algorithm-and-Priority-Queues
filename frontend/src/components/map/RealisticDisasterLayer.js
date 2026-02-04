import React from 'react';
import { Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

const RealisticDisasterLayer = ({ disasters }) => {
    return (
        <>
            {disasters.map(d => {
                let iconUrl = '';
                let className = ''; // For extra CSS if needed (e.g. blend mode)

                if (d.type === 'fire') {
                    iconUrl = '/images/fire.gif';
                    className = 'fx-fire-gif';
                }
                else if (d.type === 'flood') {
                    iconUrl = '/images/water.gif';
                    className = 'fx-flood-gif';
                }
                else if (d.type === 'chemical') {
                    iconUrl = '/images/biohazard.gif';
                    className = ''; // No filter needed for custom asset
                }

                // Custom Icon with Image
                const icon = L.divIcon({
                    className: `custom-disaster-icon ${className}`,
                    html: `<div style="
                        width: 80px; 
                        height: 80px; 
                        background-image: url('${iconUrl}');
                        background-size: cover;
                        background-position: center;
                        border-radius: 50%;
                        box-shadow: 0 0 20px rgba(0,0,0,0.5);
                        opacity: 0.9;
                    "></div>`,
                    iconSize: [80, 80],
                    iconAnchor: [40, 40]
                });

                return (
                    <React.Fragment key={d.id}>
                        {/* 1. TACTICAL CIRCLE (Geometric Radius) */}
                        <Circle
                            center={d.position}
                            radius={d.radius}
                            pathOptions={{
                                color: d.type === 'fire' ? '#ef4444' : d.type === 'flood' ? '#3b82f6' : '#10b981',
                                fillColor: d.type === 'fire' ? '#ef4444' : d.type === 'flood' ? '#3b82f6' : '#10b981',
                                fillOpacity: 0.2,
                                weight: 1,
                                dashArray: '4 4'
                            }}
                        />

                        {/* 2. VISUAL CORE (GIF) */}
                        <Marker position={d.position} icon={icon} interactive={false} />
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default RealisticDisasterLayer;
