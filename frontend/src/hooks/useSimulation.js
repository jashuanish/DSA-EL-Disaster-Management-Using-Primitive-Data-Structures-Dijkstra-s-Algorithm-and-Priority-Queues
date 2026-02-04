import { useState, useEffect, useRef, useCallback } from 'react';



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
    // SERVER-SIDE SIMULATION HANDLER
    // -----------------------------------------------------------
    const [simulationSteps, setSimulationSteps] = useState([]);
    
    // resetState definition
    const resetState = () => {
        setIsSimulating(false);
        setAlgoState({ visited: [], frontier: [], currentEdge: null, path: [], stepDescription: "Ready." });
        setUserHeading(0);
        setSimulationSteps([]);
    };

    const runBackendSimulation = async () => {
        try {
            const payload = {
                start: userStart,
                shelters: userShelters,
                disasters: disasters
            };

            const res = await fetch('http://127.0.0.1:8000/simulation/path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            // 1. Update Graph Visualization with Backend's Modified Graph (Nodes & Edges)
            setVisualGraphData(data.final_graph);

            // 2. Iterate through steps
            setSimulationSteps(data.steps);
            setIsSimulating(true);

        } catch (err) {
            console.error("Simulation failed:", err);
            alert("Simulation failed. Check backend.");
        }
    };

    const startSimulation = () => {
        if (!userStart || userShelters.length === 0) {
            alert("Please place a Start Point and at least one Shelter!");
            return;
        }
        resetState();
        runBackendSimulation();
    };

    const step = useCallback(() => {
        if (!isSimulating) return;

        // REPLAY BACKEND STEPS
        setSimulationSteps(prevSteps => {
            if (prevSteps.length === 0) {
                setIsSimulating(false);
                clearInterval(intervalRef.current);
                return [];
            }
            
            // Consume the first step from the queue
            const [currentStep, ...remainingSteps] = prevSteps;
            setAlgoState(prevState => ({ ...prevState, ...currentStep }));
            return remainingSteps;
        });
    }, [isSimulating]);

    useEffect(() => {
        if (isSimulating && simulationSteps.length > 0) {
            intervalRef.current = setInterval(step, speed);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isSimulating, speed, step, simulationSteps]);

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
                const lat = p1[0] + (p2[0] - p1[0]) * progress;
                const lng = p1[1] + (p2[1] - p1[1]) * progress;
                const newPos = [lat, lng];
                setUserStart(newPos);

                const bearing = getBearing(p1, p2);
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
