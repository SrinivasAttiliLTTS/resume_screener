# backend/app.py
import os
import shutil
import tempfile
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List
import io
import pandas as pd

from ai_resume_screen import parse_jd, extract_text, analyze_resume

app = FastAPI(title="Resume Screening API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return {"status": "ok"}


@app.post("/upload-jd")
async def upload_jd(jd_file: UploadFile = File(None), jd_text: str = Form(None)):
    text = ""
    if jd_file:
        contents = await jd_file.read()
        try:
            text = contents.decode("utf-8", errors="ignore")
        except:
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(jd_file.filename)[1])
            tmp.write(contents)
            tmp.flush()
            tmp.close()
            text = extract_text(tmp.name)
            os.unlink(tmp.name)
    elif jd_text:
        text = jd_text
    else:
        raise HTTPException(status_code=400, detail="Provide jd_file or jd_text")

    parsed = parse_jd(text)
    return JSONResponse(parsed)


@app.post("/analyze-resumes")
async def analyze_resumes(jd_text: str = Form(...), resumes: List[UploadFile] = File(...)):
    jd_skills = parse_jd(jd_text)

    results = []
    workdir = tempfile.mkdtemp(prefix="resumes_")
    try:
        for upload in resumes:
            filename = upload.filename
            tmp_path = os.path.join(workdir, filename)
            with open(tmp_path, "wb") as f:
                f.write(await upload.read())

            text = extract_text(tmp_path)
            analysis = analyze_resume(jd_skills, text)
            result = {"Name": filename, **analysis}
            results.append(result)

    finally:
        shutil.rmtree(workdir, ignore_errors=True)

    return {"results": results}


@app.post("/export-excel")
async def export_excel(results: List[dict]):
    df = pd.DataFrame(results)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False)
    output.seek(0)
    headers = {'Content-Disposition': 'attachment; filename="results.xlsx"'}
    return StreamingResponse(output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)
