import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import InquiryDecisionFlow from './InquiryDecisionFlow';
import { ProjectNames } from './types';
import Layout from './components/layout';
import './styles/global.css';

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = () => {
  const [projectData, setProjectData] = useState<ProjectNames | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProjectNames = async () => {
      try {
        const response = await window.fs.readFile('data/project_names.json');
        const text = new TextDecoder().decode(response);
        const data: ProjectNames = JSON.parse(text);
        setProjectData(data);
        
        console.log(`Loaded ${data.total_count} project names. Last updated: ${data.last_updated}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading project names:', error);
        setIsLoading(false);
      }
    };

    loadProjectNames();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading project data...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Client Inquiry Tickets Review
          </h1>
          {projectData && (
            <p className="text-sm text-gray-600 mt-2">
              Last updated: {new Date(projectData.last_updated).toLocaleDateString()}
            </p>
          )}
        </header>
        
        <main>
          <InquiryDecisionFlow projectData={projectData} />
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Total Projects Available: {projectData?.total_count || 0}</p>
        </footer>
      </div>
    </Layout>
  );
};

// Initialize React application
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Render the App component instead of directly rendering Layout
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);