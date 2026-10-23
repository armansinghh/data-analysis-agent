import uuid
from fastapi import FastAPI, File, UploadFile
import pandas as pd

app = FastAPI()
storage = {}

# ALLOWED_EXTENSIONS = {".csv"} commented out because it is not used in the current code

@app.get("/health")
def read_root():
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
    df = storage[file_id]
    return {"question": question, "columns": list(df.columns)}