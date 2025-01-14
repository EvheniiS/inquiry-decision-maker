import json
import re
from collections import defaultdict

# Initialize data structures
inquiry_data = defaultdict(lambda: defaultdict(lambda: {"Details": None}))

# Define the regex patterns
inquiry_pattern = r"[A-Z]+-[0-9]+"
env_version_pattern = r"(DEV|TEST|LIVETEST|PROD)\s(?:\d+\.\d+(/\d+\.\d+)*)(?:\s\d+\.\d+)*"

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
        env_version_raw = env_version_match.group(0)

        # Extract and format the version logic
        versions = re.findall(r"\d+\.\d+(?:/\d+\.\d+)*", env_version_raw)
        if len(versions) > 1:
            # Format version ranges for upgrades or conversions
            env_version = f"{versions[0]} -> {versions[-1]}"
        else:
            env_version = versions[0]  # Single version

        # Remove the inquiry from the details string
        details = line.replace(f" - {inquiry}", "").strip()

        # Assign details
        inquiry_data[inquiry][env_version_raw]["Details"] = details
        inquiry_data[inquiry][env_version_raw]["Environment_Version"] = env_version

# Convert grouped data to the desired format
final_output = []
for inquiry, env_data in inquiry_data.items():
    env_versions = []
    for env_version_raw, info in env_data.items():
        env_versions.append({
            "Environment_Version": info["Environment_Version"],
            "Details": info["Details"]
        })
    final_output.append({
        "Inquiry": inquiry,
        "Environment_Versions": env_versions
    })

# Save the final output to JSON
output_grouped_path = "./jsonObj/Enhanced_Environment_Versions.json"
with open(output_grouped_path, "w", encoding="utf-8") as json_file:
    json.dump(final_output, json_file, indent=4)

print(f"Enhanced grouped data saved to {output_grouped_path}")
