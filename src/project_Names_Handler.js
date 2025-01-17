// Function to load project names from JSON and populate select
async function loadProjectNames() {
    try {
        const response = await fetch('project_names.json');
        const data = await response.json();
        
        const selectElement = document.getElementById('nameSelect');
        
        // Clear existing options except the first one
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        
        // Add project names as options
        data.project_names.forEach(projectName => {
            const option = document.createElement('option');
            option.value = projectName;
            option.textContent = projectName;
            selectElement.appendChild(option);
        });
        
        // Add "not_tested" option at the end
        const notTestedOption = document.createElement('option');
        notTestedOption.value = 'not_tested';
        notTestedOption.textContent = 'Not Tested';
        selectElement.appendChild(notTestedOption);
        
        console.log(`Loaded ${data.total_count} project names. Last updated: ${data.last_updated}`);
    } catch (error) {
        console.error('Error loading project names:', error);
    }
}

// Function to toggle sections (your existing functionality)
function toggleSections() {
    const selectedValue = document.getElementById('nameSelect').value;
    const startButton = document.getElementById('startButton');
    
    if (selectedValue) {
        startButton.style.display = 'block';
        // Add your existing toggle logic here
    } else {
        startButton.style.display = 'none';
    }
}

// Load project names when the page loads
document.addEventListener('DOMContentLoaded', loadProjectNames);