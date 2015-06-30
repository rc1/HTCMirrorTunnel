Restesque Schema
================

```json
{
    "motor": {
        "controller": {
            "heartbeat": NOW,
            "is-enabled": y/n
        },
        "rotation: {
            "direction": "forward" | "none" | "backward",
            "speed": "high" | "low" | "medium"
        }
    },
    "host": {
        "control": {
             "mode": "disabled" | "manual" | "sequence" | "phone-1" |
        }
    },
    "punter": {
        "config": {}
        "phone-1": {
            "heartbeat": NOW,
            "rotation": -50:50
    }
}
```
