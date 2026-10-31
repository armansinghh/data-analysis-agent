import uuid

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from charts import bar_chart, hist_chart
from nlp import detect_op, match_columns
from store import clean_numeric, filenames, storage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")
    try:
        df = pd.read_csv(file.file)
    except (pd.errors.ParserError, pd.errors.EmptyDataError, UnicodeDecodeError):
        raise HTTPException(status_code=400, detail="Could not read this file as a CSV.")
    finally:
        file.file.close()
    if df.empty:
        raise HTTPException(status_code=400, detail="The CSV has no data rows.")

    file_id = str(uuid.uuid4())
    storage[file_id] = clean_numeric(df)
    filenames[file_id] = file.filename
    rows, columns = df.shape
    return {"file_id": file_id, "filename": file.filename, "rows": rows, "columns": columns}


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