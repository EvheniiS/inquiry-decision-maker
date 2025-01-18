import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProjectSelector = ({ onProjectSelect, onEnvironmentSelect }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [date, setDate] = useState('');
  const [environment, setEnvironment] = useState('');
  const [version, setVersion] = useState('');

  // Load projects from JSON
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await window.fs.readFile('project_names.json');
        const data = JSON.parse(new TextDecoder().decode(response));
        setProjects(data.project_names);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, []);

  // Load testing history when all fields are selected
  useEffect(() => {
    const checkTestingStatus = async () => {
      if (selectedProject && date && environment && version) {
        try {
          const response = await window.fs.readFile('testing_history.json');
          const data = JSON.parse(new TextDecoder().decode(response));
          
          // Find matching inquiry data
          const projectPrefix = selectedProject.split('-')[0];
          const testingData = data.find(item => 
            item.Inquiry.startsWith(projectPrefix)
          );

          if (testingData) {
            const envDetails = testingData.Environment_Details.find(detail => {
              return detail.Environment_Version.includes(environment) &&
                     detail.Environment_Version.includes(version) &&
                     new Date(date) >= new Date(detail.StartDate) &&
                     new Date(date) <= new Date(detail.EndDate);
            });

            onEnvironmentSelect({
              wasTested: !!envDetails,
              details: envDetails?.Details || [],
              environment,
              version,
              date
            });
          }
        } catch (error) {
          console.error('Error checking testing status:', error);
        }
      }
    };

    checkTestingStatus();
  }, [selectedProject, date, environment, version]);

  const handleProjectChange = (e) => {
    const project = e.target.value;
    setSelectedProject(project);
    onProjectSelect(project);
  };

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 pt-4">
        <div>
          <label className="block mb-2 font-medium">Select Project:</label>
          <select 
            className="w-full p-2 border rounded" 
            value={selectedProject}
            onChange={handleProjectChange}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <>
            <div>
              <label className="block mb-2 font-medium">Ticket Creation Date:</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Environment:</label>
              <select 
                className="w-full p-2 border rounded"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
              >
                <option value="">Select environment</option>
                <option value="DEV">DEV</option>
                <option value="TEST">TEST</option>
                <option value="LIVETEST">LIVETEST</option>
                <option value="PROD">PROD</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Version:</label>
              <select 
                className="w-full p-2 border rounded"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              >
                <option value="">Select version</option>
                <option value="3.41/4.41">3.41/4.41</option>
                <option value="5.x">5.x</option>
                <option value="5.xx">5.xx</option>
              </select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectSelector;