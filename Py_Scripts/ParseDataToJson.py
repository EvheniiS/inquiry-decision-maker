import json
import re
from collections import defaultdict
from datetime import datetime
import os

class QADataParser:
    def __init__(self, debug=True):
        self.debug = debug
        
        # Core patterns
        self.date_pattern = r"\d{1,2}/\d{1,2}/\d{2}"
        self.inquiry_pattern = r"[A-Z]+-[0-9]+"
        
        # Simplified environment pattern - only the four base types and combinations
        self.environment_pattern = r"""
            (?:QA\s*-\s*)?                          # Optional QA prefix
            ((?:DEV|TEST|LIVETEST|PROD)             # First environment
            (?:/(?:DEV|TEST|LIVETEST|PROD))*)       # Additional environments
            (?:\s+QA)?                              # Optional QA suffix
        """
        
        # Version pattern
        self.version_pattern = r"""
            (
                (?:3\.41/4\.41)                     # Legacy version
                (?:\s*-\s*5\.\d+)?                  # Optional conversion target
                |
                (?:5\.\d+)                          # Single modern version
                (?:\s*-\s*5\.\d+)?                  # Optional range end
            )
        """
        
        # Combined pattern for environment and version
        self.env_version_pattern = f"""
            .*?                                     # Any text before
            {self.environment_pattern}              # Environment group
            [\s-]*                                  # Flexible spacing/dashes
            {self.version_pattern}                  # Version group
            (?=\s*(?:-|$|\())                      # Lookahead for end
        """
        
        self.debug_info = {
            'processed_lines': 0,
            'skipped_lines': [],
            'parsed_lines': [],
            'date_lines': []
        }

    def log_debug(self, message, line="", category="info"):
        if self.debug:
            if category == "skip":
                self.debug_info['skipped_lines'].append({"line": line, "reason": message})
            elif category == "parse":
                self.debug_info['parsed_lines'].append({"line": line, "parsed_data": message})
            elif category == "date":
                self.debug_info['date_lines'].append({"line": line, "date": message})

    def clean_line(self, line):
        original = line
        line = line.replace(" LT ", " LIVETEST ").replace(" LIVE ", " PROD ")
        line = line.replace("→", "-")  # Replace arrow with hyphen
        line = re.sub(r'\s+', ' ', line)
        line = re.sub(r'\s*-\s*$', '', line)
        cleaned = line.strip()
        
        if original != cleaned:
            self.log_debug("Line cleaned", f"Original: '{original}' -> Cleaned: '{cleaned}'")
        return cleaned

    def extract_date(self, line):
        match = re.search(self.date_pattern, line)
        if match:
            raw_date = match.group(0)
            formatted_date = datetime.strptime(raw_date, "%m/%d/%y").strftime("%m/%d/%Y")
            self.log_debug(formatted_date, line, "date")
            return formatted_date
        return None

    def extract_inquiry(self, line):
        match = re.search(self.inquiry_pattern, line)
        inquiry = match.group(0) if match else "Unspecified"
        self.log_debug(f"Extracted inquiry: {inquiry}", line)
        return inquiry

    def extract_env_version(self, line):
        pattern = re.compile(self.env_version_pattern, re.VERBOSE)
        match = pattern.search(line)
        
        if match:
            env = match.group(1).strip()
            version = match.group(2).strip()
            
            # Clean up environment
            env = re.sub(r'\s+QA\s*', ' ', env).strip()
            
            # Clean up version
            version = re.sub(r'\s*-\s*', '-', version).strip()
            
            self.log_debug(f"Successfully extracted - env: {env}, version: {version}", line, "parse")
            return env, version
            
        self.log_debug(f"Failed to match environment/version pattern", line, "skip")
        return None, None

    def parse_file(self, file_path):
        inquiry_data = defaultdict(lambda: defaultdict(lambda: {"Details": [], "Dates": []}))
        current_date = None
        
        with open(file_path, "r", encoding="utf-8") as file:
            for line in file:
                self.debug_info['processed_lines'] += 1
                line = self.clean_line(line)
                
                # Skip irrelevant lines
                if re.search(r"(holiday|vacation|sick leave|-{3,})", line, re.IGNORECASE):
                    self.log_debug("Irrelevant line (holiday/vacation/sick leave/separator)", line, "skip")
                    continue
                
                # Update current date if found
                date = self.extract_date(line)
                if date:
                    current_date = date
                    continue
                
                # Skip empty lines or date-only lines
                if not line or re.match(r'^[A-Za-z]{3}\s+\d{1,2}/\d{1,2}/\d{2}', line):
                    self.log_debug("Empty line or date-only line", line, "skip")
                    continue
                
                # Extract main components
                env, version = self.extract_env_version(line)
                if env and version:
                    inquiry = self.extract_inquiry(line)
                    env_version = f"{env} {version}"
                    
                    # Remove inquiry from details if present
                    details = re.sub(rf"\s*-\s*{inquiry}\s*$", "", line).strip()
                    
                    # Store the data
                    inquiry_data[inquiry][env_version]["Details"].append(details)
                    if current_date:
                        inquiry_data[inquiry][env_version]["Dates"].append(current_date)
                else:
                    self.log_debug("Failed to extract environment and version", line, "skip")
        
        return self.format_output(inquiry_data)

    def format_output(self, inquiry_data):
        final_output = []
        for inquiry, env_data in inquiry_data.items():
            env_details = []
            for env_version, info in env_data.items():
                # Split Environment and Version from Environment_Version
                if " " in env_version:
                    environment, version = env_version.split(" ", 1)
                else:
                    environment, version = env_version, None
                
                unique_dates = sorted(set(info["Dates"]))
                env_details.append({
                    "Environment": environment.strip(),
                    "Version": version.strip() if version else None,
                    "Details": list(set(info["Details"])),
                    "Dates": unique_dates,
                    "StartDate": min(unique_dates, default=None),
                    "EndDate": max(unique_dates, default=None)
                })
            
            final_output.append({
                "Inquiry": inquiry,
                "Environment_Details": env_details
            })
        
        return final_output

    def print_debug_summary(self):
        """Print detailed debug summary"""
        if self.debug:
            print("\n=== DEBUG SUMMARY ===")
            print(f"Total lines processed: {self.debug_info['processed_lines']}")
            print(f"Total dates found: {len(self.debug_info['date_lines'])}")
            print(f"Successfully parsed lines: {len(self.debug_info['parsed_lines'])}")
            print(f"Skipped lines: {len(self.debug_info['skipped_lines'])}")
            
            print("\n=== SKIPPED LINES ===")
            for skip_info in self.debug_info['skipped_lines']:
                if "Irrelevant line" not in skip_info['reason']:  # Skip showing holiday/vacation lines
                    print(f"Line: '{skip_info['line']}'")
                    print(f"Reason: {skip_info['reason']}\n")

            print("\n=== SUCCESSFULLY PARSED LINES ===")
            for parse_info in self.debug_info['parsed_lines'][:5]:  # Show first 5 successful parses
                print(f"Line: '{parse_info['line']}'")
                print(f"Parsed: {parse_info['parsed_data']}\n")

def test_with_file(file_path):
    parser = QADataParser(debug=True)
    
    try:
        print(f"\nParsing file: {file_path}")
        output = parser.parse_file(file_path)
        
        # Save output
        output_file = os.path.join("./src/data", "testing_history.json")

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=4)
        
        print(f"\nOutput saved to: {output_file}")
        
        # Print debug summary
        parser.print_debug_summary()
        
        return output
        
    except Exception as e:
        print(f"Error during parsing: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        # Assuming the script is in the Py_Scripts directory
        file_name = "PI_15-19.txt"
        file_path = os.path.join("Py_Scripts", file_name)

        print(file_path)  # This will output: Py_Scripts/PI_15-18_Cleaned.txt

        output = test_with_file(file_path)
        print("\nParsing completed successfully!")
    except Exception as e:
        print(f"Failed to complete parsing: {str(e)}")