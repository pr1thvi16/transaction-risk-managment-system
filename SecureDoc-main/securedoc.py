import streamlit as st
import cv2
import numpy as np
import re
import json
from pyzbar.pyzbar import decode, ZBarSymbol
import easyocr

st.set_page_config(page_title="SecureDoc", layout="centered")

# Make button green
st.markdown("""
<style>
div.stButton > button {
    background-color: #16a34a !important;
    color: white !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 0.6rem 1.2rem !important;
    font-weight: 700 !important;
}
div.stButton > button:hover {
    background-color: #15803d !important;
}
</style>
""", unsafe_allow_html=True)

st.title("SecureDoc - Employee ID Verification")
st.write("Upload ID card -> read QR + printed text -> check for tampering")

# Load OCR once
@st.cache_resource
def load_reader():
    return easyocr.Reader(['en'], gpu=False)
reader = load_reader()

# Clean up messy OCR text
def normalize_text(text):
    text = str(text).upper().strip()
    text = re.sub(r"[^A-Z0-9 ]", " ", text)  # Remove junk chars
    text = re.sub(r"\s+", " ", text)         # Fix spaces
    return text

# Remove spaces from employee IDs
def normalize_emp_id(text):
    return normalize_text(text).replace(" ", "")

# Read QR code data (JSON or key=value format)
def parse_qr_payload(qr_text):
    payload = {"raw": qr_text, "name": "", "emp_id": ""}
    text = qr_text.strip()
    
    # Try JSON first
    try:
        obj = json.loads(text)
        for k, v in obj.items():
            key = str(k).lower()
            if "name" in key:
                payload["name"] = str(v)
            if "emp" in key or "id" in key:
                payload["emp_id"] = str(v)
        return payload
    except:
        pass
    
    # Try key=value format
    for line in text.split('\n'):
        if "=" in line:
            k, v = line.split("=", 1)
            key = k.lower()
            if "name" in key:
                payload["name"] = v.strip()
            if "emp" in key or "id" in key:
                payload["emp_id"] = v.strip()
    return payload

# Crop specific areas of image (name, ID, photo)
def crop_relative(img, x1r, y1r, x2r, y2r):
    h, w = img.shape[:2]
    x1, y1, x2, y2 = int(w*x1r), int(h*y1r), int(w*x2r), int(h*y2r)
    return img[y1:y2, x1:x2], (x1, y1, x2, y2)

# Read text from cropped area using OCR
def read_text_from_roi(roi):
    results = reader.readtext(roi)
    texts = []
    for _, text, conf in results:
        if conf > 0.25:  # Only good confidence
            texts.append(normalize_text(text))
    return " ".join(texts), results

# Find employee ID pattern (EMP1234)
def extract_emp_id_from_text(text):
    text = normalize_emp_id(text)
    match = re.search(r"(EMP)?\d{3,10}", text)
    return match.group(0) if match else ""

# ELA - detects if image was edited (tampering check)
def compute_ela_map(image_bgr, quality=90):
    # Re-compress image and compare to original
    ok, enc = cv2.imencode('.jpg', image_bgr, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    if not ok:
        return np.zeros(image_bgr.shape[:2], dtype=np.uint8)
    rec = cv2.imdecode(enc, cv2.IMREAD_COLOR)
    diff = cv2.absdiff(image_bgr, rec)
    return cv2.normalize(cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY), None, 0, 255, cv2.NORM_MINMAX)

# Check if QR/photo areas look tampered
def analyze_region_tamper(region_bgr):
    # Find edges (too smooth = edited)
    gray = cv2.cvtColor(region_bgr, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 100, 200)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Color variation check
    region_float = region_bgr.astype(np.float32)
    mean_color = np.mean(region_float, (0, 1))
    color_distance = np.linalg.norm(region_float - mean_color, axis=2)
    
    # ELA tampering score
    ela = compute_ela_map(region_bgr)
    
    # Score everything
    edge_score = np.sum(edges > 0) / edges.size


    # More sensitive for Paint edits
    score = 0
    if edge_score > 0.08: score += 25    # Was 0.12
    if len(contours) > 15: score += 20   # Was 25  
    if np.mean(color_distance) > 22: score += 20  # Was 28
    if np.mean(ela) / 255 > 0.12: score += 25    # Was 0.18
    
    score = min(score, 99)
    return score, "SUSPICIOUS" if score >= 60 else "NORMAL"

# === MAIN APP ===
uploaded_file = st.file_uploader("Upload employee ID card", type=["jpg", "jpeg", "png"])
analyze = st.button("Analyze Document")

if uploaded_file is not None:
    # Load image
    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    # Show original
    st.subheader("Original ID Card")
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        st.image(img, channels="BGR", width=360)
    
    if analyze:
        # 1. Find QR code
        qr_codes = decode(img, symbols=[ZBarSymbol.QRCODE])
        if not qr_codes:
            st.error("No QR code found!")
            st.stop()
        
        qr = qr_codes[0]
        qr_text = qr.data.decode("utf-8", errors="ignore")
        qr_payload = parse_qr_payload(qr_text)
        
        # 2. Crop specific areas
        name_roi, name_rect = crop_relative(img, 0.08, 0.26, 0.52, 0.43)
        emp_roi, emp_rect = crop_relative(img, 0.18, 0.50, 0.38, 0.59)
        photo_roi, photo_rect = crop_relative(img, 0.52, 0.53, 0.96, 0.71)
        
        # 3. Read text from areas
        name_text, _ = read_text_from_roi(name_roi)
        emp_text, _ = read_text_from_roi(emp_roi)
        
        ocr_name = normalize_text(name_text)
        ocr_emp_id = extract_emp_id_from_text(emp_text)
        qr_name = normalize_text(qr_payload.get("name", ""))
        qr_emp_id = normalize_emp_id(qr_payload.get("emp_id", ""))
        
        # 4. Check matches
        name_match = qr_name and ocr_name and (ocr_name in qr_name or qr_name in ocr_name)
        emp_id_match = qr_emp_id and ocr_emp_id and (ocr_emp_id == qr_emp_id or 
                                                   ocr_emp_id.endswith(qr_emp_id))
        
        # 5. Check tampering
        qr_x, qr_y, qr_w, qr_h = qr.rect.left, qr.rect.top, qr.rect.width, qr.rect.height
        pad = 10
        qr_roi = img[max(0,qr_y-pad):min(img.shape[0],qr_y+qr_h+pad),
                     max(0,qr_x-pad):min(img.shape[1],qr_x+qr_w+pad)]
        
        qr_score, _ = analyze_region_tamper(qr_roi)
        photo_score, _ = analyze_region_tamper(photo_roi)
        overall_status = "SUSPICIOUS" if max(qr_score, photo_score) >= 60 else "NORMAL"
        
        # 6. Draw boxes on result
        result_img = img.copy()
        cv2.rectangle(result_img, name_rect, (0, 255, 0), 2)   # Green: name
        cv2.rectangle(result_img, emp_rect, (255, 255, 0), 2)  # Cyan: emp
        cv2.rectangle(result_img, photo_rect, (255, 0, 0), 2)  # Red: photo
        cv2.rectangle(result_img, (qr_x-pad, qr_y-pad, qr_w+pad*2, qr_h+pad*2), (0, 0, 255), 2)  # Blue: QR
        
        # 7. Show results
        st.subheader("Results")
        r1, r2, r3 = st.columns([1, 2, 1])
        with r2:
            st.image(result_img, channels="BGR", width=360)
        
        c1, c2 = st.columns(2)
        with c1:
            st.metric("Name", "MATCH" if name_match else "NO MATCH")
            st.metric("Emp ID", "MATCH" if emp_id_match else "NO MATCH")
            st.metric("Tamper", overall_status)
        with c2:
            st.metric("QR Score", f"{qr_score}%")
            st.metric("Photo Score", f"{photo_score}%")
        
        # Show what was read
        col1, col2 = st.columns(2)
        with col1:
            st.info(f"QR Name: {qr_payload.get('name', 'N/A')}")
            st.info(f"OCR Name: {ocr_name or 'N/A'}")
        with col2:
            st.info(f"QR ID: {qr_payload.get('emp_id', 'N/A')}")
            st.info(f"OCR ID: {ocr_emp_id or 'N/A'}")