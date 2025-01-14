# Re-import necessary modules after reset
import re
import json
from collections import defaultdict

# Reload the file after reset
file_path = "PI18 - Access Digital Implementation testing Queue for QA.txt"
with open(file_path, "r", encoding="utf-8") as file:
    content = file.readlines()

# Initialize data structures
entries = []
current_date = None

# Patterns for extracting data
date_pattern = r"^[A-Za-z]{3} \d{2}/\d{2}/\d{2} -"
entry_pattern = r"(?P<details>.+?) - (?P<inquiry>[A-Z0-9\-]+)"
env_version_pattern = r"(DEV|TEST|LIVETEST|PROD)\s\d+\.\d+"

# Process each line
for line in content:
    line = line.strip()

    # Identify a new date
    if re.match(date_pattern, line):
        current_date = line.split(" -")[0]
        continue

    # Process valid entries with Inquiry
    match = re.search(entry_pattern, line)
    if match:
        details = match.group("details")
        inquiry = match.group("inquiry")

        # Extract environment and version
        env_version_match = re.search(env_version_pattern, details)
        env_version = env_version_match.group(0) if env_version_match else None

        # Add to entries
        entries.append({
            "Date": current_date,
            "Inquiry": inquiry,
            "Details": details,
            "Environment_Version": env_version,
        })

# Group by Inquiry and Environment_Version
grouped_data = defaultdict(lambda: {"Begin_Date": None, "End_Date": None, "Details": None, "Environment_Version": None})

for entry in entries:
    key = (entry["Inquiry"], entry["Environment_Version"])
    if not grouped_data[key]["Begin_Date"]:
        grouped_data[key]["Begin_Date"] = entry["Date"]
    grouped_data[key]["End_Date"] = entry["Date"]
    grouped_data[key]["Details"] = entry["Details"]
    grouped_data[key]["Environment_Version"] = entry["Environment_Version"]

# Convert grouped data to the desired format
final_data = []
for (inquiry, env_version), values in grouped_data.items():
    final_data.append({
        "Inquiry": inquiry,
        "Begin_Date": values["Begin_Date"],
        "End_Date": values["End_Date"],
        "Details": values["Details"],
        "Environment_Version": values["Environment_Version"]
    })

# Save the final parsed data to a JSON file
output_path = "Parsed_Testing_Data.json"

with open(output_path, "w", encoding="utf-8") as json_file:
    json.dump(final_data, json_file, indent=4)

output_path