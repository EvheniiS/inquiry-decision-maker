import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProjectSelector = ({ onProjectSelect, onEnvironmentSelect }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [date, setDate] = useState('');
  const [environment, setEnvironment] = useState('');
  const [version, setVersion] = useState('');
  const [testingDetails, setTestingDetails] = useState(null);

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

  // Load testing history when all fields are selected
  useEffect(() => {
    const checkTestingStatus = async () => {
      if (selectedProject && date && environment && version) {
        console.debug("Starting testing status check...");
        console.debug("Inputs:", { selectedProject, date, environment, version });
  
        try {
          const response = await fetch('/src/data/testing_history.json');
          const data = await response.json();
  
          console.debug("Fetched testing history:", data);
  
          // Find matching inquiry data
          const projectPrefix = selectedProject.split('-')[0];
          const testingData = data.find(item => 
            item.Inquiry.startsWith(projectPrefix) && item.Inquiry !== "Unspecified"
          );
  
          console.debug("Matched project data:", testingData);
  
          if (testingData) {
            const relevantDetails = testingData.Environment_Details.map(detail => {
              const isEnvironmentMatch = detail.Environment.includes(environment);
              const isVersionMatch = detail.Version.includes(version);
  
              let testingStatus = "Not Tested";
              let timeGap = null;
  
              if (isEnvironmentMatch && isVersionMatch) {
                const ticketDate = new Date(date);
                const startDate = new Date(detail.StartDate);
                const endDate = new Date(detail.EndDate);
  
                if (ticketDate < startDate) {
                  testingStatus = "Not Tested";
                  timeGap = Math.ceil((startDate - ticketDate) / (1000 * 60 * 60 * 24));
                } else if (ticketDate >= startDate && ticketDate <= endDate) {
                  testingStatus = "Tested";
                  timeGap = Math.ceil((ticketDate - startDate) / (1000 * 60 * 60 * 24));
                } else if (ticketDate > endDate) {
                  testingStatus = "Tested";
                  timeGap = Math.ceil((ticketDate - endDate) / (1000 * 60 * 60 * 24));
                }
  
                return {
                  ...detail,
                  isEnvironmentMatch,
                  isVersionMatch,
                  testingStatus,
                  timeGap,
                };
              }
  
              return null;
            }).filter(Boolean);
  
            console.debug("Relevant details with checks:", relevantDetails);
  
            if (relevantDetails.length > 0) {
              const matchedDetail = relevantDetails[0]; // Use the first match for now
              console.debug("Final matched detail:", matchedDetail);
  
              setTestingDetails({
                wasTested: matchedDetail.testingStatus === "Tested",
                details: matchedDetail.Details || [],
                timeGap: matchedDetail.timeGap,
                status: matchedDetail.testingStatus,
              });
  
              onEnvironmentSelect({
                wasTested: matchedDetail.testingStatus === "Tested",
                details: matchedDetail.Details || [],
                environment,
                version,
                date,
                timeGap: matchedDetail.timeGap,
                status: matchedDetail.testingStatus,
              });
            } else {
              console.debug("No matching detail found for selected inputs.");
              setTestingDetails({ wasTested: false, details: [], status: "Not Tested" });
              onEnvironmentSelect({ wasTested: false, details: [], environment, version, date, status: "Not Tested" });
            }
          } else {
            console.debug("No matching inquiry found for project prefix:", projectPrefix);
            setTestingDetails({ wasTested: false, details: [], status: "Not Tested" });
            onEnvironmentSelect({ wasTested: false, details: [], environment, version, date, status: "Not Tested" });
          }
        } catch (error) {
          console.error('Error checking testing status:', error);
        }
      } else {
        console.debug("Missing one or more required inputs. Skipping check.");
      }
    };
  
    checkTestingStatus();
  }, [selectedProject, date, environment, version]);
  

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 pt-4">
        <div>
          <label className="block mb-2 font-medium">Select Project:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedProject}
            onChange={(e) => {
              const project = e.target.value;
              setSelectedProject(project);
              onProjectSelect(project);
            }}
          >
            <option value="">Select a project</option>
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
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
                <option value="5.5">5.5</option>
                <option value="5.6">5.6</option>
                <option value="5.7">5.7</option>
                <option value="5.8">5.8</option>
                <option value="5.9">5.9</option>
                <option value="5.10">5.10</option>
                <option value="5.11">5.11</option>
                <option value="5.12">5.12</option>
              </select>
            </div>

            {testingDetails && (
              <div className={`mt-4 ${testingDetails.wasTested ? "text-green-500" : "text-red-500"}`}>
                <h3 className="text-lg font-semibold">
                  Testing Status: {testingDetails.wasTested ? "Tested" : "Not Tested"}
                </h3>
                {testingDetails.details.length > 0 && (
                  <ul className="mt-2 list-disc list-inside">
                    {testingDetails.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectSelector;
