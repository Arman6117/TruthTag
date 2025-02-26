from fastapi import FastAPI, UploadFile, File
from paddleocr import PaddleOCR
import cv2
import numpy as np
import io

app = FastAPI()
ocr = PaddleOCR(use_angle_cls=True, lang="en")  # Load OCR model

@app.post("/ocr")
async def process_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    result = ocr.ocr(img, cls=True)
    extracted_text = "\n".join([line[1][0] for line in result[0]])
 
    print(extracted_text)
    return {"text": extracted_text}

# Run the server: uvicorn server:app --host 0.0.0.0 --port 8000
