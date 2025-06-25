# utils.py
import json

def get_modo():
    try:
        with open("modo.json", "r") as f:
            return json.load(f)["modo"]
    except:
        return "online"

def set_modo(modo):
    with open("modo.json", "w") as f:
        json.dump({"modo": modo}, f)
