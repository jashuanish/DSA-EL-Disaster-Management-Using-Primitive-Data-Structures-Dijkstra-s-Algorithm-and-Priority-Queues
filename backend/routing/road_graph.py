NODES = {
    "A": (12.9716, 77.5946),
    "B": (12.9725, 77.6000),
    "C": (12.9680, 77.6050),
    "D": (12.9650, 77.6100),
    "E": (12.9600, 77.5950),

    "S":  (12.9352, 77.6245),   # normal shelter
    "S2": (12.9400, 77.5850),   # emergency shelter
    
    # NEW DETOUR NODES
    "F": (12.9550, 77.6300),   # East Flank
    "G": (12.9550, 77.5700),   # West Flank
}

GRAPH = {
    # A connects to East(F) and West(G) flanks now
    "A": [("B", 300, 1), ("C", 400, 5), ("E", 500, 0), ("F", 800, 1), ("G", 800, 1)],
    
    "B": [("D", 350, 1), ("G", 300, 1)], # B can divert West
    "C": [("D", 200, 5), ("F", 400, 1)], # C can divert East
    "D": [("S", 600, 0)],
    
    "E": [("S", 900, 0)], 
    
    # New Flank Routes to Shelter (Longer but independent)
    "F": [("S", 1000, 1)],
    "G": [("S", 1100, 1)],
    
    "S": []
}
