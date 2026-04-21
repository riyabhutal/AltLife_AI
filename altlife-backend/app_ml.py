# app_ml.py — Realistic Life Prediction Engine for AltLife
# Generates life-like, psychological, grounded stories using happiness/success/finance metrics.

import random
from typing import Dict, Any, Optional

# Offsets for each life path
PATH_OFFSETS = {
    "Corporate Ladder":      (-2, +8, +10),
    "Entrepreneurship":      (+2, +6, +8),
    "Creative Pursuit":      (+6, +10, -4),
    "Academic Excellence":   (+1, +9, +2),
    "World Explorer":        (+8, +4, -6),
    "Work-Life Balance":     (+10, -2, -1),
}

def _apply_path_offset(choice: Optional[str], happiness: float, success: float, finance: float):
    """Apply deterministic offsets based on selected path."""
    if not choice:
        return int(happiness), int(success), int(finance)

    offset = PATH_OFFSETS.get(choice)
    if offset is None:
        offset = (0, 0, 0)

    h = int(max(0, min(100, round(happiness + offset[0]))))
    s = int(max(0, min(100, round(success + offset[1]))))
    f = int(max(0, min(100, round(finance + offset[2]))))
    return h, s, f

# -------------------------------------------------------------
# REALISTIC PSYCHOLOGICAL STORY GENERATOR
# -------------------------------------------------------------

def realistic_story(name: str, path: str, h: int, s: int, f: int, age: int) -> str:
    """Generate a clean, realistic, psychological story like the screenshot."""

    if path == "World Explorer":
        return (
            f"At {age}, {name} chooses exploration over predictability. Their natural curiosity pushes them "
            f"toward new environments, cultures, and experiences that slowly shape their worldview. The early years "
            f"bring both excitement and discomfort—travel teaches {name} resilience, openness, and emotional strength. "
            f"Over time, these experiences deepen their understanding of people and themselves. With a happiness score "
            f"of {h}%, success rating of {s}%, and financial health at {f}%, {name}'s path reflects a desire for a life "
            f"rich in meaning, perspective, and personal growth."
        )

    if path == "Entrepreneurship":
        return (
            f"At {age}, {name} steps into entrepreneurship with uncertainty but strong internal drive. The early years "
            f"are challenging—financial pressure, self-doubt, and constant decision-making force {name} to grow quickly. "
            f"Little milestones begin to build confidence: a product that works, a customer who believes, a strategy that "
            f"finally clicks. Each lesson deepens {name}'s resilience. By the sixth year, their journey reflects courage, "
            f"clarity, and emotional maturity. With happiness at {h}%, success at {s}%, and financial stability at {f}%, "
            f"this path shows {name}'s determination to create a life that aligns with their ambition and values."
        )

    if path == "Corporate Ladder":
        return (
            f"At {age}, {name} enters the structured world of corporate growth. The first years revolve around proving "
            f"themselves—learning workplace dynamics, building communication skills, and handling increasing responsibility. "
            f"Progress arrives gradually but steadily, shaping {name}'s confidence and leadership. Mentors, new roles, and "
            f"professional milestones slowly create a sense of stability. With a happiness level of {h}%, success at {s}%, "
            f"and financial health at {f}%, this path reflects patience, discipline, and long-term ambition."
        )

    if path == "Creative Pursuit":
        return (
            f"{name} chooses a creative path at {age}, motivated by emotion and self-expression. The journey carries moments "
            f"of inspiration and moments of doubt—yet each experience shapes their artistic identity. Over time, {name} learns "
            f"to trust their instincts, refine their craft, and create work that resonates with others. By year six, creativity "
            f"becomes a grounding force in their life. With a happiness score of {h}%, success at {s}%, and financial wellness "
            f"at {f}%, this path represents authenticity, emotional depth, and the courage to express one's truth."
        )

    if path == "Academic Excellence":
        return (
            f"At {age}, {name} chooses a path of intellectual growth and discipline. The early years test their focus and "
            f"patience—long study sessions, deadlines, and constant learning. Over time, {name} develops strong analytical "
            f"skills and a deeper sense of purpose. Achievements and academic milestones reinforce their confidence. With "
            f"happiness at {h}%, success at {s}%, and financial outcomes at {f}%, this journey reflects dedication, mastery, "
            f"and long-term personal development."
        )

    if path == "Work-Life Balance":
        return (
            f"At {age}, {name} prioritizes stability and emotional well-being. This path encourages slow, steady progress—"
            f"healthy routines, meaningful relationships, and intentional choices. Challenges arise, but {name} navigates "
            f"them with calm awareness. By year six, their life feels grounded and fulfilling. With a happiness score of {h}%, "
            f"success at {s}%, and financial stability at {f}%, this journey reflects the desire for harmony, sustainability, "
            f"and inner peace."
        )

    # fallback
    return f"{name} begins a journey shaped by growth, emotional maturity, and meaningful change."

# -------------------------------------------------------------
# MAIN ML PREDICTION FUNCTION
# -------------------------------------------------------------

def predict_outcome(profile: Dict[str, Any], chosen_path: str, model=None, base_prediction=None) -> Dict[str, Any]:
    """Deterministic realistic predictor with story + 6-year projection."""

    name = profile.get("name", "You")

    try:
        age = int(profile.get("age") or 25)
    except:
        age = 25

    career = (profile.get("career") or "").lower()
    lifestyle = (profile.get("lifestyle") or "").lower()

    # Base score from personality
    base = 50 + (max(18, min(45, age)) - 18) * 0.6
    if "engineer" in career or "doctor" in career:
        base += 4
    if "ambitious" in lifestyle:
        base += 2
    if "relaxed" in lifestyle:
        base -= 2

    happiness = base - 3
    success   = base + 8
    finance   = base + 2

    # Apply effect from chosen path
    h, s, f = _apply_path_offset(chosen_path, happiness, success, finance)

    # Build realistic 6-year projection
    trend_map = {
        "Corporate Ladder": (+1, +2, +3),
        "Entrepreneurship": (+2, +1, +0),
        "Creative Pursuit": (+1, +2, -1),
        "Academic Excellence": (+1, +3, +1),
        "World Explorer": (+2, 0, -2),
        "Work-Life Balance": (+3, -1, 0)
    }

    trend = trend_map.get(chosen_path, (0, 0, 0))
    rnd = random.Random((h + s + f) % 99991)

    series = []
    for i in range(6):
        series.append({
            "year": f"Y{i+1}",
            "happiness": max(0, min(100, h + trend[0]*i + rnd.randint(-4, 4))),
            "success":   max(0, min(100, s + trend[1]*i + rnd.randint(-4, 4))),
            "finance":   max(0, min(100, f + trend[2]*i + rnd.randint(-4, 4))),
        })

    # REALISTIC STORY
    story = realistic_story(name, chosen_path, h, s, f, age)

    return {
        "finalScore": round(((h + s + f) / 3) / 100, 3),
        "explanation": None,
        "outcomeDetails": {
            "happiness": h,
            "success": s,
            "finance": f,
        },
        "series": {
            "happiness": [{"year": s["year"], "value": s["happiness"]} for s in series],
            "success":   [{"year": s["year"], "value": s["success"]} for s in series],
            "finance":   [{"year": s["year"], "value": s["finance"]} for s in series],
        },
        "story": story,
        "chosenPath": chosen_path
    }
