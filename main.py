from fastapi import FastAPI, File, UploadFile
import pandas as pd

app = FastAPI()

# ALLOWED_EXTENSIONS = {".csv"} commented out because it is not used in the current code

@app.get("/health")
def read_root():
    return {"status": "ok"}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    rows, columns = df.shape
    file.file.close()
    return {"filename": file.filename, "rows": rows, "columns": columns}

    
