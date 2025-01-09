import pdfplumber
import os

# Path to your PDF file
pdf_path = "PI18 - Access Digital Implementation testing Queue for QA.pdf"

# Dynamically generate the output file name
base_name = os.path.splitext(os.path.basename(pdf_path))[0]  # Extract file name without extension
output_path = f"{base_name}.txt"  # Append .txt to the file name

# Open the PDF and extract text
with pdfplumber.open(pdf_path) as pdf:
    all_text = ""
    for page in pdf.pages:
        # Extract text from each page
        all_text += page.extract_text() + "\n"

# Save the raw text to a file
with open(output_path, "w", encoding="utf-8") as file:
    file.write(all_text)

print(f"Raw text extracted and saved to {output_path}")
