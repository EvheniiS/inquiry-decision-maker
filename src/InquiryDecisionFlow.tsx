import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { ProjectNames, InquiryData } from './types';

declare global {
  interface Window {
    fs: {
      readFile: (path: string) => Promise<Uint8Array>;
    }
  }
}

interface Step {
  number: number;
  label: string;
}

const InquiryDecisionFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [inquiryDate, setInquiryDate] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [inquiryData, setInquiryData] = useState<InquiryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const steps: Step[] = [
    { number: 1, label: 'Select Project' },
    { number: 2, label: 'Select Date' },
    { number: 3, label: 'Select Environment' },
    { number: 4, label: 'Select Version' }
  ];

  // Load project names from JSON
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project names
        const projectResponse = await window.fs.readFile('project_names.json');
        const projectText = new TextDecoder().decode(projectResponse);
        const projectData: ProjectNames = JSON.parse(projectText);
        setProjectNames(projectData.project_names);

        // Load inquiry data
        const inquiryResponse = await window.fs.readFile('Example.json');
        const inquiryText = new TextDecoder().decode(inquiryResponse);
        const inquiryData: InquiryData[] = JSON.parse(inquiryText);
        setInquiryData(inquiryData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Environment options
  const environments: string[] = ['DEV', 'TEST', 'LIVETEST', 'PROD'];
  
  // Get available versions from inquiry data
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

  const renderStep = () => {
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

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

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
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.number === currentStep
                    ? 'bg-blue-500 text-white'
                    : step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200'
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