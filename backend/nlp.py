import re

OPS = {
    "average": "mean", "avg": "mean", "mean": "mean",
    "total": "sum", "sum": "sum",
    "maximum": "max", "max": "max", "highest": "max",
    "minimum": "min", "min": "min", "lowest": "min",
    "count": "count",
}


def words(text: str) -> list[str]:
    return [w for w in re.split(r"[^a-z0-9]+", text.lower()) if w]


def detect_op(q: str):
    for w in words(q):
        if w in OPS:
            return OPS[w]
    return None


def match_columns(q: str, columns) -> list[str]:
    q_words = set(words(q)) - set(OPS)
    return [c for c in columns if any(w in q_words for w in words(c))]