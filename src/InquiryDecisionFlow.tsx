import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { ProjectNames, InquiryData } from './types';

// Define the Step interface
interface Step {
  number: number;
  label: string;
}

// Define component props interface
interface InquiryDecisionFlowProps {
  projectData: ProjectNames | null;
}

const InquiryDecisionFlow: React.FC<InquiryDecisionFlowProps> = ({ projectData }) => {
  // State declarations
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [inquiryDate, setInquiryDate] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [inquiryData, setInquiryData] = useState<InquiryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get project names from props
  const projectNames = projectData?.project_names || [];

  // Define steps
  const steps: Step[] = [
    { number: 1, label: 'Select Project' },
    { number: 2, label: 'Select Date' },
    { number: 3, label: 'Select Environment' },
    { number: 4, label: 'Select Version' }
  ];

  // Environment options
  const environments: string[] = ['DEV', 'TEST', 'LIVETEST', 'PROD'];

// Load inquiry data
useEffect(() => {
  const loadInquiryData = async () => {
    try {
      const response = await window.fs.readFile('/src/data/Example.json');
      const text = new TextDecoder().decode(response);
      const data: InquiryData[] = JSON.parse(text);
      setInquiryData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading inquiry data:', error);
      // Show error state instead of just setting isLoading to false
      setIsLoading(false);
    }
  };

  loadInquiryData();
}, []);

  // Helper functions
  const getAvailableVersions = (): string[] => {
    const versions = new Set<string>();
    inquiryData.forEach(inquiry => {
      inquiry.Environment_Details.forEach(detail => {
        versions.add(detail.Environment_Version.split(' ')[1]);
      });
    });
    return Array.from(versions).sort();
  };

  const handleNext = (): void => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = (): void => {
    setCurrentStep(prev => prev - 1);
  };

  // Render step content
  const renderStep = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="block font-medium text-gray-700">Select Project:</label>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">Select a project</option>
              {projectNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <button
              onClick={handleNext}
              disabled={!selectedProject}
              className={`w-full p-2 rounded-md ${
                selectedProject 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block font-medium text-gray-700">Select Inquiry Date:</label>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={inquiryDate}
              onChange={(e) => setInquiryDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleBack}
                className="w-1/2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!inquiryDate}
                className={`w-1/2 p-2 rounded-md ${
                  inquiryDate 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <label className="block font-medium text-gray-700">Select Environment:</label>
            <div className="grid grid-cols-2 gap-2">
              {environments.map((env) => (
                <button
                  key={env}
                  onClick={() => setSelectedEnvironment(env)}
                  className={`p-2 rounded-md ${
                    selectedEnvironment === env
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleBack}
                className="w-1/2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedEnvironment}
                className={`w-1/2 p-2 rounded-md ${
                  selectedEnvironment 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        const versions = getAvailableVersions();
        return (
          <div className="space-y-4">
            <label className="block font-medium text-gray-700">Select Version:</label>
            <div className="grid grid-cols-2 gap-2">
              {versions.map((version) => (
                <button
                  key={version}
                  onClick={() => setSelectedVersion(version)}
                  className={`p-2 rounded-md ${
                    selectedVersion === version
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {version}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleBack}
                className="w-1/2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedVersion}
                className={`w-1/2 p-2 rounded-md ${
                  selectedVersion 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Check Status
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-lg text-gray-700">Loading inquiry data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Inquiry Decision Flow</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Rest of your content */}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Main render
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Inquiry Decision Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`step-indicator ${
                  step.number === currentStep
                    ? 'step-active'
                    : step.number < currentStep
                    ? 'step-completed'
                    : 'step-pending'
                }`}
              >
                {step.number}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
        {renderStep()}
        {currentStep === 4 && selectedVersion && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium">Selected Options:</h3>
            <ul className="mt-2 space-y-1">
              <li>Project: {selectedProject}</li>
              <li>Date: {inquiryDate}</li>
              <li>Environment: {selectedEnvironment}</li>
              <li>Version: {selectedVersion}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InquiryDecisionFlow;