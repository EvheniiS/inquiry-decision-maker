# Inquiry Decision Maker

## Overview
The Inquiry Decision Maker is an interactive tool designed for analyzing and labeling client inquiry tickets. Built with modern web technologies, the project provides a structured workflow to ensure efficient decision-making and accurate ticket categorization.

## Features
- **Project Selection**: Users can select projects from a predefined list (`project_names.json`).
- **Dynamic Workflows**: Step-by-step decision-making paths based on ticket data.
- **Testing Status Verification**: Automatically determines if tickets have been tested using `testing_history.json`.
- **Labeling System**: Generates appropriate labels for tickets based on user input and decision trees.
- **Modular Components**: Cleanly structured React components for each step of the workflow.

## Technologies Used
- **React** with Vite: For fast and efficient front-end development.
- **Tailwind CSS**: For styling and layout.
- **JSON Data Integration**: For dynamic project and testing history loading.
- **JavaScript/ES6**: For utility functions and logic.

## File Structure
```
inquiry-decision-maker/
├── src/
│   ├── components/                 # React components
│   │   ├── ProjectSelector.jsx     # Handles project selection
│   │   ├── EnvironmentSelector.jsx # Environment & version selection
│   │   ├── IssueTypeSelector.jsx   # Issue categorization
│   │   ├── TimeSelector.jsx        # Timing analysis
│   │   └── RootCauseSelector.jsx   # Root cause determination
│   │
│   ├── data/                       # JSON data files
│   │   ├── project_names.json      # List of available projects
│   │   └── testing_history.json    # Testing history records
│   │
│   ├── utils/                      # Utility scripts
│   │   ├── dataLoader.js           # Handles data parsing
│   │   └── labelGenerator.js       # Automates label generation
│   │
│   ├── styles/                     # Tailwind CSS styles
│   │   └── main.css                
│   │
│   └── main.jsx                    # Entry point for the app
│
├── scripts/                        # Additional tools
│   └── parse_history.py            # Parses and pre-processes data
│
├── package.json                    # Project metadata and dependencies
├── postcss.config.js               # PostCSS configuration for Tailwind CSS
├── tailwind.config.js              # Tailwind CSS configuration
├── vite.config.js                  # Vite build configuration
└── index.html                      # Main HTML file
```

## Workflow
1. **Project Selection**: Choose a project and verify against `project_names.json`.
2. **Testing Verification**: Automatically determine testing status using `testing_history.json`.
3. **Label Decision Tree**:
   - Categorize tickets as FAD, issues, improvements, or clarifications.
   - Generate labels based on root cause analysis and timing.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd inquiry-decision-maker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000`.

## Development
### Adding Components
- Each decision point in the workflow is a modular component.
- New steps can be added by creating React components and updating the main workflow logic.

### Data Updates
- **Project Names**: Update `project_names.json` to modify available projects.
- **Testing History**: Update `testing_history.json` to reflect recent testing data.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your fork and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For questions or feedback, please reach out to [your contact email or GitHub profile].

