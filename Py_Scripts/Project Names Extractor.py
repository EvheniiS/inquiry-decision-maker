import json
from datetime import datetime

def extract_project_names(input_json_path, output_json_path):
    # Read the input JSON file
    with open(input_json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Extract unique project names
    project_names = set()
    for item in data:
        if item['Inquiry'] != 'Unspecified':
            # Split on '-' and take the first part
            project_name = item['Inquiry'].split('-')[0]
            project_names.add(project_name)
    
    # Create output structure
    output_data = {
        "project_names": sorted(list(project_names)),  # Sort alphabetically
        "total_count": len(project_names),
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Write to output file
    with open(output_json_path, 'w', encoding='utf-8') as file:
        json.dump(output_data, file, indent=2)
    
    return output_data

if __name__ == "__main__":
    # Example usage
    input_path = "./jsonObj/Fix-NotAllDataParsed_PI_15-18_Cleaned.json"  # Your parsed QA data
    output_path = "project_names.json"   # New file for project names
    
    result = extract_project_names(input_path, output_path)
    print(f"Found {result['total_count']} unique project names")
    print("Project names:", result['project_names'])