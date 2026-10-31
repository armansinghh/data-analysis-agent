import io
import re
import uuid
import base64

import matplotlib
matplotlib.use("Agg")  # render to memory, no GUI window
import matplotlib.pyplot as plt
import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

storage: dict[str, pd.DataFrame] = {}

# dark theme so charts match the UI cards
plt.rcParams.update({
    "figure.facecolor": "#121216", "axes.facecolor": "#121216",
    "axes.edgecolor": "#26262E", "axes.labelcolor": "#9494A0",
    "text.color": "#F4F4F6", "xtick.color": "#9494A0", "ytick.color": "#9494A0",
    "grid.color": "#1A1A20", "grid.linestyle": "--", "figure.dpi": 150,
})

# keyword -> pandas aggregation
OPS = {
    "average": "mean", "avg": "mean", "mean": "mean",
    "total": "sum", "sum": "sum",
    "maximum": "max", "max": "max", "highest": "max",
    "minimum": "min", "min": "min", "lowest": "min",
    "count": "count",
}


# ---------- helpers ----------

def words(text: str) -> list[str]:
    return [w for w in re.split(r"[^a-z0-9]+", text.lower()) if w]


def detect_op(q: str):
    for w in words(q):
        if w in OPS:
            return OPS[w]
    return None


def match_columns(q: str, columns) -> list[str]:
    q_words = set(words(q)) - set(OPS)  # ignore operation words
    return [c for c in columns if any(w in q_words for w in words(c))]


def to_base64(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()


def bar_chart(series, title: str) -> str:
    fig, ax = plt.subplots(figsize=(6, 3.5))
    series.plot(kind="bar", ax=ax, color="#6366F1")
    ax.set_title(title, fontsize=10)
    ax.grid(axis="y")
    plt.xticks(rotation=30, ha="right")
    return to_base64(fig)


def hist_chart(values, title: str) -> str:
    fig, ax = plt.subplots(figsize=(6, 3.5))
    ax.hist(values.dropna(), bins=10, color="#6366F1")
    ax.set_title(title, fontsize=10)
    ax.grid(axis="y")
    return to_base64(fig)


# ---------- endpoints ----------

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    file_id = str(uuid.uuid4())
    storage[file_id] = df
    rows, columns = df.shape
    file.file.close()
    return {"file_id": file_id, "rows": rows, "columns": columns}


@app.post("/query/{file_id}")
def query_data(file_id: str, question: str):
    if file_id not in storage:
        raise HTTPException(status_code=404, detail="Dataset not found. Please upload again.")
    df = storage[file_id]

    op = detect_op(question)
    if op is None:
        return {"answer": "I can do average, total, max, min and count. Try: 'average Quantity'."}

    cols = match_columns(question, df.columns)
    numeric = [c for c in cols if pd.api.types.is_numeric_dtype(df[c])]
    group_cols = [c for c in cols if c not in numeric]

    # plain row count
    if op == "count" and not numeric:
        if group_cols:
            g = group_cols[0]
            result = df.groupby(g).size()
            return {
                "answer": f"Count of rows by {g}.",
                "pandas_op": f"df.groupby('{g}').size()",
                "chart": bar_chart(result, f"Count by {g}"),
            }
        return {"answer": f"The dataset has {len(df)} rows.", "pandas_op": "len(df)"}

    # more than one numeric match = ambiguous, ask instead of guessing
    if len(numeric) > 1:
        return {"answer": f"Ambiguous: did you mean {' or '.join(numeric)}?"}
    if not numeric:
        return {"answer": f"I couldn't find a numeric column in your question. Columns: {', '.join(df.columns)}"}

    target = numeric[0]

    # grouped result, e.g. "total Quantity by Part"
    if group_cols:
        g = group_cols[0]
        result = df.groupby(g)[target].agg(op)
        return {
            "answer": f"{op} of {target} by {g}.",
            "pandas_op": f"df.groupby('{g}')['{target}'].{op}()",
            "chart": bar_chart(result, f"{op} of {target} by {g}"),
        }

    # single number
    value = df[target].agg(op)
    return {
        "answer": f"The {op} of {target} is {round(float(value), 2)}.",
        "pandas_op": f"df['{target}'].{op}()",
        "chart": hist_chart(df[target], f"Distribution of {target}"),
    }