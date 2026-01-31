from collections import deque

class SensorStore:
    def __init__(self):
        self.data = {
            "rain": deque(maxlen=5),
            "water": deque(maxlen=5),
            "temp": deque(maxlen=5),
            "humidity": deque(maxlen=5),
            "wind": deque(maxlen=5),
        }

    def add(self, rain, water, temp, hum, wind):
        self.data["rain"].append(rain)
        self.data["water"].append(water)
        self.data["temp"].append(temp)
        self.data["humidity"].append(hum)
        self.data["wind"].append(wind)

    def get(self, key):
        return list(self.data[key])
