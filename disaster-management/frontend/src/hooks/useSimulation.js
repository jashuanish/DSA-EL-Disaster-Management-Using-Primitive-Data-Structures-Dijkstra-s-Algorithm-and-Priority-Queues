import { useState, useEffect, useRef, useCallback } from 'react';

// Priority Queue Implementation for Dijkstra
class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(val, priority) { this.values.push({ val, priority }); this.sort(); }
    dequeue() { return this.values.shift(); }
    sort() { this.values.sort((a, b) => a.priority - b.priority); }
    isEmpty() { return this.values.length === 0; }
}

export function useSimulation() {
    // Graph Data
    const [originalGraphData, setOriginalGraphData] = useState({ nodes: {}, graph: {} });

    // Simulation State
    const [isSimulating, setIsSimulating] = useState(false);
    const [speed, setSpeed] = useState(300); // Faster default

    // User Placed Entities
    const [disasters, setDisasters] = useState([]);
    const [userShelters, setUserShelters] = useState([]); // [{id, position}]
    const [userStart, setUserStart] = useState(null); // {position}

    // NEW: Heading for Car Animation
    const [userHeading, setUserHeading] = useState(0);

    // Algorithm State
    const [algoState, setAlgoState] = useState({
        visited: [], frontier: [], currentEdge: null, path: [],
        stepDescription: "Ready. Place Start Point & Shelters."
    });

    const generatorRef = useRef(null);
    const intervalRef = useRef(null);

    // State for Visualization (Merged Nodes)
    const [visualGraphData, setVisualGraphData] = useState({ nodes: {}, graph: {} });
    const [isNavigating, setIsNavigating] = useState(false);
    const animationRef = useRef(null);

    // Fetch Base Graph
    useEffect(() => {
        fetch('http://127.0.0.1:8000/graph')
            .then(res => res.json())
            .then(data => setOriginalGraphData(data))
            .catch(err => console.error("Failed to load graph:", err));
    }, []);

    // Sync original data to visual data initially
    useEffect(() => {
        if (originalGraphData.nodes) {
            setVisualGraphData(originalGraphData);
        }
    }, [originalGraphData]);

    // -----------------------------------------------------------
    // GRAPH INJECTION LOGIC (The "Arbitrary Point" Engine)
    // -----------------------------------------------------------
    const prepareGraph = () => {
        const nodes = { ...originalGraphData.nodes };
        const graph = JSON.parse(JSON.stringify(originalGraphData.graph));

        const connectToGraph = (id, pos) => {
            nodes[id] = pos;
            graph[id] = [];
            const nearest = Object.entries(originalGraphData.nodes)
                .map(([nid, npos]) => {
                    const d = Math.sqrt((npos[0] - pos[0]) ** 2 + (npos[1] - pos[1]) ** 2);
                    return { id: nid, dist: d };
                })
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 3);

            nearest.forEach(n => {
                const distMeters = n.dist * 111000;
                graph[id].push([n.id, distMeters, 1]);
                if (!graph[n.id]) graph[n.id] = [];
                graph[n.id].push([id, distMeters, 1]);
            });
        };

        if (userStart) {
            connectToGraph("USER_START", userStart);

            disasters.forEach(d => {
                const center = d.position;
                const safeRadiusDeg = (d.radius * 1.3) / 111111;
                const numPoints = 8;

                let prevNodeId = null;
                const firstNodeId = `Avoid_D${d.id}_0`;

                for (let i = 0; i < numPoints; i++) {
                    const angle = (i * 2 * Math.PI) / numPoints;
                    const wx = center[0] + safeRadiusDeg * Math.cos(angle);
                    const wy = center[1] + safeRadiusDeg * Math.sin(angle);

                    const nodeId = `Avoid_D${d.id}_${i}`;
                    nodes[nodeId] = [wx, wy];
                    if (!graph[nodeId]) graph[nodeId] = [];

                    if (prevNodeId) {
                        const dist = Math.sqrt((nodes[prevNodeId][0] - wx) ** 2 + (nodes[prevNodeId][1] - wy) ** 2) * 111000;
                        graph[prevNodeId].push([nodeId, dist, 5]);
                        graph[nodeId].push([prevNodeId, dist, 5]);
                    }
                    prevNodeId = nodeId;

                    const distToStart = Math.sqrt((userStart[0] - wx) ** 2 + (userStart[1] - wy) ** 2) * 111000;
                    if (!graph["USER_START"]) graph["USER_START"] = [];
                    graph["USER_START"].push([nodeId, distToStart, 5]);
                    graph[nodeId].push(["USER_START", distToStart, 5]);

                    userShelters.forEach(s => {
                        const sId = `SHELTER_${s.id}`;
                        const distToShelter = Math.sqrt((s.position[0] - wx) ** 2 + (s.position[1] - wy) ** 2) * 111000;
                        if (!graph[sId]) graph[sId] = [];
                        graph[nodeId].push([sId, distToShelter, 5]);
                        graph[sId].push([nodeId, distToShelter, 5]);
                    });
                }
                const pFirst = nodes[firstNodeId];
                const pLast = nodes[prevNodeId];
                const distClosing = Math.sqrt((pFirst[0] - pLast[0]) ** 2 + (pFirst[1] - pLast[1]) ** 2) * 111000;
                graph[prevNodeId].push([firstNodeId, distClosing, 5]);
                graph[firstNodeId].push([prevNodeId, distClosing, 5]);
            });

            userShelters.forEach(s => {
                const shelterNodeId = `SHELTER_${s.id}`;
                const p1 = userStart;
                const p2 = s.position;
                const distDeg = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
                const distMeters = distDeg * 111000;
                if (!graph["USER_START"]) graph["USER_START"] = [];
                if (!graph[shelterNodeId]) graph[shelterNodeId] = [];
                graph["USER_START"].push([shelterNodeId, distMeters, 300]);
                graph[shelterNodeId].push(["USER_START", distMeters, 300]);
            });
        }
        userShelters.forEach((s, idx) => connectToGraph(`SHELTER_${s.id}`, s.position));
        return { nodes, graph };
    };

    // -----------------------------------------------------------
    // DIJKSTRA GENERATOR (Uniform Cost Search)
    // -----------------------------------------------------------
    const runDijkstraStep = function* (startNode, targetPrefix, nodes, graph, activeDisasters, userShelters) {
        const pq = new PriorityQueue();
        const gScore = {};
        const previous = {};
        const visited = new Set();

        // DIJKSTRA: Heuristic is always 0.
        // We focus purely on Accumulated Cost (Distance + Risk).
        const heuristic = (nodeId) => 0;

        Object.keys(nodes).forEach(node => gScore[node] = Infinity);
        gScore[startNode] = 0;
        pq.enqueue(startNode, 0);

        yield {
            visited: [], frontier: [startNode], currentEdge: null, path: [],
            stepDescription: `DIJKSTRA INITIALIZED. Scanning all routes for optimal safety.`
        };

        while (!pq.isEmpty()) {
            const { val: currentNode } = pq.dequeue();
            if (visited.has(currentNode)) continue;
            visited.add(currentNode);

            if (String(currentNode).startsWith(targetPrefix)) {
                yield {
                    visited: Array.from(visited),
                    frontier: [],
                    currentEdge: null,
                    path: reconstructPath(previous, currentNode),
                    stepDescription: `DIJKSTRA SUCCESS: Optimal Safe Haven ${currentNode} secured!`
                };
                return;
            }

            const neighbors = graph[currentNode] || [];

            for (const neighborData of neighbors) {
                const [neighbor, distance, baseRisk] = neighborData;
                let riskPenalty = 0;
                const p1 = nodes[currentNode];
                const p2 = nodes[neighbor];

                const distToSegment = (p, v, w) => {
                    const l2 = (w[0] - v[0]) ** 2 + (w[1] - v[1]) ** 2;
                    if (l2 === 0) return Math.sqrt((p[0] - v[0]) ** 2 + (p[1] - v[1]) ** 2);
                    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
                    t = Math.max(0, Math.min(1, t));
                    const proj = [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];
                    return Math.sqrt((p[0] - proj[0]) ** 2 + (p[1] - proj[1]) ** 2);
                };

                activeDisasters.forEach(d => {
                    const radiusDeg = (d.radius * 1.2) / 111111;
                    if (distToSegment(d.position, p1, p2) < radiusDeg) {
                        riskPenalty = Infinity;
                    }
                });

                if (riskPenalty === Infinity) continue;

                // WEIGHT CALCULATION: Distance + Risk
                const weight = distance + (baseRisk * 100);
                const tentativeG = gScore[currentNode] + weight;

                yield {
                    visited: Array.from(visited),
                    frontier: pq.values.map(v => v.val),
                    currentEdge: { from: currentNode, to: neighbor },
                    path: [],
                    stepDescription: `Evaluating ${currentNode} -> ${neighbor}`
                };

                if (tentativeG < gScore[neighbor]) {
                    gScore[neighbor] = tentativeG;
                    previous[neighbor] = currentNode;
                    pq.enqueue(neighbor, tentativeG);
                }
            }
        }
        yield { visited: [], frontier: [], currentEdge: null, path: [], stepDescription: "🚨 FAILURE: All exit vectors compromised." };
    };

    function reconstructPath(previous, endNode) {
        const path = [];
        let cur = endNode;
        while (previous[cur]) {
            path.push(cur);
            cur = previous[cur];
        }

        path.push(cur);
        return path.reverse();
    }

    const resetState = () => {
        setIsSimulating(false);
        setAlgoState({ visited: [], frontier: [], currentEdge: null, path: [], stepDescription: "Ready." });
        generatorRef.current = null;
        setUserHeading(0);
    };

    const startSimulation = () => {
        if (!userStart || userShelters.length === 0) {
            alert("Please place a Start Point and at least one Shelter!");
            return;
        }
        resetState();
        const { nodes, graph } = prepareGraph();
        setVisualGraphData({ nodes, graph });
        generatorRef.current = runDijkstraStep("USER_START", "SHELTER_", nodes, graph, disasters, userShelters);
        setIsSimulating(true);
    };

    // -----------------------------------------------------------
    // CINEMATIC TRAVERSAL
    // -----------------------------------------------------------
    const traversePath = () => {
        if (!algoState.path || algoState.path.length < 2) return;
        setIsNavigating(true);

        const pathNodes = algoState.path
            .map(id => visualGraphData.nodes[id])
            .filter(p => !!p);

        let currentIndex = 0;
        let progress = 0;
        const speedFactor = 0.007;

        const toRad = (deg) => deg * Math.PI / 180;
        const toDeg = (rad) => rad * 180 / Math.PI;

        const getBearing = (start, end) => {
            const lat1 = toRad(start[0]);
            const lat2 = toRad(end[0]);
            const dLon = toRad(end[1] - start[1]);
            const y = Math.sin(dLon) * Math.cos(lat2);
            const x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            const brng = toDeg(Math.atan2(y, x));
            return (brng + 360) % 360;
        };

        const animate = () => {
            if (currentIndex >= pathNodes.length - 1) {
                setIsNavigating(false);
                return;
            }

            const p1 = pathNodes[currentIndex];
            const p2 = pathNodes[currentIndex + 1];

            progress += speedFactor;

            if (progress >= 1) {
                progress = 0;
                currentIndex++;
                if (currentIndex >= pathNodes.length - 1) {
                    setIsNavigating(false);
                    return;
                }
            }

            if (currentIndex < pathNodes.length - 1) {
                const lat = p1[0] + (pathNodes[currentIndex + 1][0] - p1[0]) * progress;
                const lng = p1[1] + (pathNodes[currentIndex + 1][1] - p1[1]) * progress;
                const newPos = [lat, lng];
                setUserStart(newPos);

                const bearing = getBearing(p1, pathNodes[currentIndex + 1]);
                setUserHeading(bearing);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const step = useCallback(() => {
        if (!generatorRef.current) return;
        const result = generatorRef.current.next();
        if (result.done) {
            setIsSimulating(false);
            clearInterval(intervalRef.current);
        } else {
            setAlgoState(prev => ({ ...prev, ...result.value }));
        }
    }, []);

    useEffect(() => {
        if (isSimulating) intervalRef.current = setInterval(step, speed);
        else clearInterval(intervalRef.current);
        return () => clearInterval(intervalRef.current);
    }, [isSimulating, speed, step]);

    const addDisaster = (type, pos) => { resetState(); setDisasters(p => [...p, { id: Date.now(), type, position: pos, radius: 500 }]); };
    const addShelter = (pos) => { resetState(); setUserShelters(p => [...p, { id: Date.now(), position: pos }]); };
    const setStartPoint = (pos) => { resetState(); setUserStart(pos); };

    return {
        graphData: visualGraphData,
        entities: { disasters, userShelters, userStart, userHeading },
        algoState,
        isSimulating,
        isNavigating,
        controls: { start: startSimulation, pause: () => setIsSimulating(false), resume: () => setIsSimulating(true), step, setSpeed, reset: resetState, traversePath },
        actions: {
            addDisaster, addShelter, setStartPoint,
            removeDisaster: (id) => { resetState(); setDisasters(p => p.filter(d => d.id !== id)); },
            removeShelter: (id) => { resetState(); setUserShelters(p => p.filter(s => s.id !== id)); }
        }
    };
}
