# SecureDoc - Employee ID Verification

## Project Description

SecureDoc is a computer vision application that verifies employee ID cards by:

- Reading QR codes containing employee data such as name and EMP ID.
- Extracting printed text using OCR from specific regions.
- Detecting tampering through image forensics.
- Cross-verifying QR data against printed text.
- Providing authenticity scores for QR and photo regions.

## Technologies and Libraries

- Streamlit for the user interface.
- OpenCV for image processing.
- EasyOCR for text extraction.
- Pyzbar for QR code decoding.
- NumPy for array and image handling.
- Custom CSS for UI styling.
- Python as the main development language.

## Computer Vision Concepts Used

1. Region of Interest extraction using relative image coordinates.
2. OCR for reading printed text from image regions.
3. QR code decoding for structured data extraction.
4. Error Level Analysis for detecting image tampering.
5. Edge analysis using Canny edge detection.
6. Image sharpness analysis using Laplacian variance.
7. Color analysis for spotting unnatural changes.

## How the Application Works

1. The user uploads an employee ID card image.
2. The app loads the image using OpenCV.
3. It detects the QR code and extracts encoded data.
4. It crops fixed regions for name, EMP ID, and photo.
5. It runs OCR on the cropped text regions.
6. It compares QR data with OCR output.
7. It checks the QR and photo regions for tampering.
8. It shows match status, tamper score, and photo clarity.

## Setup Instructions

### Windows

1. Install Python 3.9 or later.
2. Create a virtual environment:
   ```bash
   python -m venv securedoc_env
   securedoc_env\Scripts\activate
   ```
3. Install the required packages:
   ```bash
   pip install streamlit opencv-python easyocr pyzbar pillow numpy
   ```
4. Save the app code as `securedoc.py`.
5. Run the app:
   ```bash
   streamlit run securedoc.py
   ```

### MacOS

1. Install Python 3.9 or later.
2. Create a virtual environment:
   ```bash
   python3 -m venv securedoc_env
   source securedoc_env/bin/activate
   ```
3. Install system dependency for QR decoding:
   ```bash
   brew install zbar
   ```
4. Install the required packages:
   ```bash
   pip install streamlit opencv-python easyocr pyzbar pillow numpy
   ```
5. Save the app code as `securedoc.py`.
6. Run the app:
   ```bash
   streamlit run securedoc.py
   ```

## How to Run

1. Open a terminal in the project folder.
2. Activate the virtual environment.
3. Start Streamlit with `streamlit run securedoc.py`.
4. Upload an employee ID card image.
5. Click Analyze Document.

## Features

- Green Analyze button with centered layout.
- QR and OCR-based verification.
- Tamper detection for QR and photo regions.
- Photo clarity checking.
- Clean result display with metrics.

## Future Scope

1. Add support for multiple ID types such as Aadhaar, PAN, Passport, and Driving License.
2. Improve document classification using machine learning.
3. Add employee record lookup through a database.
4. Add real-time camera-based verification.
5. Build cloud deployment support for production use.
6. Add batch processing for multiple ID cards.
7. Add advanced image forensics using frequency-domain methods.
8. Expose the app as a REST API for enterprise integration.

## Sample Output

- Name Match: MATCH or NO MATCH
- EMP ID Match: MATCH or NO MATCH
- Tamper Status: NORMAL or SUSPICIOUS
- QR Score: percentage value
- Photo Score: percentage value
- Photo Clarity: CLEAR or BLURRY

## Troubleshooting

- If `pyzbar` is missing, install `zbar` on Mac or the appropriate Windows package.
- EasyOCR may take a little time on the first run because it downloads its model files.
- Resize very large images if the app feels slow.
