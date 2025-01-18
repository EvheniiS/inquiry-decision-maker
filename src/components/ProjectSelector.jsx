import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProjectSelector = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  // Load project names from JSON
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/src/data/project_names.json');
        const data = await response.json();
        setProjects(data.project_names);
      } catch (error) {
        console.error('Error loading project names:', error);
      }
    };

    loadProjects();
  }, []);

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
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSelector;
