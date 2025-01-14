import json
import re
from collections import defaultdict
from datetime import datetime

# Initialize data structures
inquiry_data = defaultdict(lambda: defaultdict(lambda: {"Details": [], "Dates": []}))

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

        # Extract and format the instance and version logic
        env_instance_match = re.match(r"(DEV|TEST|LIVETEST|PROD)", env_version_raw)
        env_instance = env_instance_match.group(0) if env_instance_match else "Unknown"
        versions = re.findall(r"\d+\.\d+(?:/\d+\.\d+)*", env_version_raw)

        if len(versions) > 1:
            env_version = f"{env_instance} {versions[0]} -> {versions[-1]}"
        else:
            env_version = f"{env_instance} {versions[0]}" if versions else env_instance

        # Remove the inquiry from the details string
        details = line.replace(f" - {inquiry}", "").strip()

        # Assign details and track dates
        inquiry_data[inquiry][env_version]["Details"].append(details)
        if current_date:
            inquiry_data[inquiry][env_version]["Dates"].append(current_date)

# Convert grouped data to the desired format
final_output = []
for inquiry, env_data in inquiry_data.items():
    env_details = []
    for env_version, info in env_data.items():
        # Deduplicate dates
        unique_dates = sorted(set(info["Dates"]))

        env_details.append({
            "Environment_Version": env_version,
            "Details": list(set(info["Details"])),  # Consolidate unique details
            "Dates": unique_dates,  # Use unique dates
            "StartDate": min(unique_dates, default=None),
            "EndDate": max(unique_dates, default=None)
        })

    final_output.append({
        "Inquiry": inquiry,
        "Environment_Details": env_details  # Renamed key
    })

# Save the final output to JSON
output_grouped_path = "./jsonObj/final_file_parse__PI_15-18_ImpQA_manual.json"
with open(output_grouped_path, "w", encoding="utf-8") as json_file:
    json.dump(final_output, json_file, indent=4)

print(f"Enhanced grouped data with adjusted format saved to {output_grouped_path}")
