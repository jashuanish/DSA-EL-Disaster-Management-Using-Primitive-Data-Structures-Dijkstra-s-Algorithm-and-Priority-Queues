def nearest_node(user_location, nodes):
    min_dist = float("inf")
    closest = None
    for node_id, coords in nodes.items():
        dist = (coords[0] - user_location[0])**2 + (coords[1] - user_location[1])**2
        if dist < min_dist:
            min_dist = dist
            closest = node_id
    return closest
