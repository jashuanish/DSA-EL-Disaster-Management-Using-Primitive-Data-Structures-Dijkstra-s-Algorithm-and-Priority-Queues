import React from 'react';
import { Circle, Polyline } from 'react-leaflet';

export default function DijkstraVisualizer({ algoState, nodes }) {
    const { visited, frontier, currentEdge, path } = algoState;

    if (!nodes || Object.keys(nodes).length === 0) return null;

    return (
        <>
            {/* CLOSED SET (Visited Nodes) - Dimmed */}
            return (
            <>
                {/* CLOSED SET (Visited Nodes) - Dimmed */}
                {visited.map(nodeId => {
                    const pos = nodes[nodeId];
                    if (!pos) return null; // Safety Check
                    return (
                        <Circle
                            key={`visited-${nodeId}`}
                            center={pos}
                            radius={30}
                            pathOptions={{ color: '#64748b', fillColor: '#64748b', fillOpacity: 0.5 }}
                        />
                    );
                })}

                {/* OPEN SET (Frontier) - Glowing */}
                {frontier.map(nodeId => {
                    const pos = nodes[nodeId];
                    if (!pos) return null; // Safety Check
                    return (
                        <Circle
                            key={`frontier-${nodeId}`}
                            center={pos}
                            radius={40}
                            pathOptions={{ color: '#f59e0b', fillColor: '#fbbf24', fillOpacity: 0.8 }}
                        />
                    );
                })}

                {/* CURRENT EDGE - Animated Scanning */}
                {currentEdge && nodes[currentEdge.from] && nodes[currentEdge.to] && (
                    <Polyline
                        positions={[nodes[currentEdge.from], nodes[currentEdge.to]]}
                        pathOptions={{ color: '#eab308', weight: 4, dashArray: '5, 10' }}
                    />
                )}

                {/* FINAL PATH (Dynamic Construction) */}
                {path.length > 1 && (
                    <Polyline
                        positions={path.map(n => nodes[n]).filter(p => !!p)} // Filter invalid points
                        pathOptions={{ color: '#10b981', weight: 6, opacity: 1 }}
                    />
                )}
            </>
            );
        </>
    );
}
