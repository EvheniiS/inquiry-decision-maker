import json
import re
from collections import defaultdict

# Initialize data structures
inquiry_data = defaultdict(lambda: defaultdict(lambda: {"Details": None}))

# Define the regex patterns
inquiry_pattern = r"[A-Z]+-[0-9]+"
env_version_pattern = r"(DEV|TEST|LIVETEST|PROD)\s\d+\.\d+"

# Read the input text file
with open("PI18 - Access Digital Implementation testing Queue for QA.txt", "r", encoding="utf-8") as file:
    content = file.readlines()

# Parse the content
for line in content:
    line = line.strip()

    # Extract inquiry and environment/version details
    inquiry_match = re.search(inquiry_pattern, line)
    env_version_match = re.search(env_version_pattern, line)

    if inquiry_match and env_version_match:
        inquiry = inquiry_match.group(0)
        env_version = env_version_match.group(0)

        # Remove the inquiry from the details string
        details = line.replace(f" - {inquiry}", "").strip()

        # Assign details
        inquiry_data[inquiry][env_version]["Details"] = details

# Convert grouped data to the desired format
final_output = []
for inquiry, env_data in inquiry_data.items():
    env_versions = []
    for env_version, info in env_data.items():
        env_versions.append({
            "Environment_Version": env_version,
            "Details": info["Details"]
        })
    final_output.append({
        "Inquiry": inquiry,
        "Environment_Versions": env_versions
    })

# Save the final output to JSON
output_grouped_path = "Simplified_Grouped_Inquiries.json"
with open(output_grouped_path, "w", encoding="utf-8") as json_file:
    json.dump(final_output, json_file, indent=4)

print(f"Simplified grouped data saved to {output_grouped_path}")
