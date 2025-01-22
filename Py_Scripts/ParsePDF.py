import pdfplumber
import os

# Update the path to include the ParsePDF directory
pdf_path = os.path.join("ParsePDF", "PI17-Testing Queue for QA.pdf")

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
