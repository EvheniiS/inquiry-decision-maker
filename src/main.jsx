import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ProjectSelector from './components/ProjectSelector';
// import EnvironmentSelector from './components/EnvironmentSelector';
import IssueTypeSelector from './components/IssueTypeSelector';
import RootCauseSelector from './components/RootCauseSelector';

// Main App Component
function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [environmentDetails, setEnvironmentDetails] = useState(null);
  const [issueType, setIssueType] = useState(null);
  const [assignedLabel, setAssignedLabel] = useState(null);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    console.log('Selected Project:', project);
  };

  const handleEnvironmentSelect = (details) => {
    setEnvironmentDetails(details);
    console.log('Environment Details:', details);
  };

  const handleIssueTypeSelect = (type) => {
    setIssueType(type);
    console.log('Selected Issue Type:', type);
  };

  const handleLabelAssign = (label) => {
    setAssignedLabel(label);
    console.log('Assigned Label:', label);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Inquiry Decision Maker
        </h1>
        <p className="text-gray-600">QA Team Analysis Tool</p>
      </header>

      <main className="space-y-6">
        {/* Step 1: Project and Environment Selection */}
        <ProjectSelector
          onProjectSelect={handleProjectSelect}
          onEnvironmentSelect={handleEnvironmentSelect}
        />

        {/* Step 2: Environment Details Validated */}
        {environmentDetails && (
          <IssueTypeSelector
            wasTested={environmentDetails.wasTested}
            onIssueTypeSelect={handleIssueTypeSelect}
          />
        )}

        {/* Step 3: Root Cause Selection */}
        {issueType === 'Issue' && environmentDetails && (
          <RootCauseSelector
            wasTested={environmentDetails.wasTested}
            selectedIssueType={issueType}
            onLabelAssign={handleLabelAssign}
          />
        )}

        {/* Debugging Information */}
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          <h3 className="text-lg font-semibold">Debugging Info</h3>
          <ul className="list-disc list-inside text-sm">
            <li>Selected Project: {selectedProject || 'None'}</li>
            <li>Environment Details: {JSON.stringify(environmentDetails) || 'None'}</li>
            <li>Selected Issue Type: {issueType || 'None'}</li>
            <li>Assigned Label: {assignedLabel || 'None'}</li>
          </ul>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Internal QA Tool - 2025</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
