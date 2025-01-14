import json
import re
from collections import defaultdict
from datetime import datetime

# Initialize data structures
inquiry_data = defaultdict(lambda: defaultdict(lambda: {"Details": None, "Dates": []}))

# Define the regex patterns
date_pattern = r"\d{1,2}/\d{1,2}/\d{2}"
inquiry_pattern = r"[A-Z]+-[0-9]+"
env_version_pattern = r"(DEV|TEST|LIVETEST|PROD)\s(?:\d+\.\d+(/\d+\.\d+)*)(?:\s\d+\.\d+)*"

# Read the input text file
with open("PI_15-18_ImpQA_manual.txt", "r", encoding="utf-8") as file:
    content = file.readlines()

# Parse the content
current_date = None
for line in content:
    line = line.strip()

    # Extract and update the current date
    date_match = re.search(date_pattern, line)
    if date_match:
        raw_date = date_match.group(0)
        # Convert to MM/DD/YYYY format
        current_date = datetime.strptime(raw_date, "%m/%d/%y").strftime("%m/%d/%Y")
        continue

    # Extract inquiry and environment/version details
    inquiry_match = re.search(inquiry_pattern, line)
    env_version_match = re.search(env_version_pattern, line)

    if inquiry_match and env_version_match:
        inquiry = inquiry_match.group(0)
        env_version_raw = env_version_match.group(0)

        # Extract and format the version logic
        versions = re.findall(r"\d+\.\d+(?:/\d+\.\d+)*", env_version_raw)
        if len(versions) > 1:
            env_version = f"{versions[0]} -> {versions[-1]}"
        else:
            env_version = versions[0]  # Single version

        # Remove the inquiry from the details string
        details = line.replace(f" - {inquiry}", "").strip()

        # Assign details and track dates
        inquiry_data[inquiry][env_version_raw]["Details"] = details
        inquiry_data[inquiry][env_version_raw]["Environment_Version"] = env_version
        inquiry_data[inquiry][env_version_raw]["Dates"].append(current_date)

# Convert grouped data to the desired format
final_output = []
for inquiry, env_data in inquiry_data.items():
    # Extract the earliest and latest dates for the inquiry
    all_dates = [
        datetime.strptime(date, "%m/%d/%Y") for info in env_data.values() for date in info["Dates"]
    ]
    start_date = min(all_dates).strftime("%m/%d/%Y")  # Format as MM/DD/YYYY
    end_date = max(all_dates).strftime("%m/%d/%Y")    # Format as MM/DD/YYYY

    env_versions = []
    for env_version_raw, info in env_data.items():
        env_versions.append({
            "Environment_Version": info["Environment_Version"],
            "Details": info["Details"]
        })

    final_output.append({
        "Inquiry": inquiry,
        "StartDate": start_date,
        "EndDate": end_date,
        "Environment_Versions": env_versions
    })

# Save the final output to JSON
output_grouped_path = "./jsonObj/final_file_parse_PI_15-18_ImpQA_manual.json"
with open(output_grouped_path, "w", encoding="utf-8") as json_file:
    json.dump(final_output, json_file, indent=4)

print(f"Enhanced grouped data with start and end dates saved to {output_grouped_path}")