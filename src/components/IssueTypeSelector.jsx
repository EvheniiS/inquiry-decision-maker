import React, { useState, useEffect } from 'react';

const IssueTypeSelector = ({ wasTested, onIssueTypeSelect }) => {
  const [selectedIssueType, setSelectedIssueType] = useState('');

  const issueTypes = [
    { label: 'Correct Behavior (CB)', value: 'CB' },
    { label: 'Changes/Improvements/Clarifications (QCR)', value: 'QCR' },
    { label: 'Issue', value: 'Issue' },
  ];

  useEffect(() => {
    // Reset selection when wasTested changes
    setSelectedIssueType('');
  }, [wasTested]);

  const handleSelection = (value) => {
    setSelectedIssueType(value);
    const prefix = wasTested ? '' : 'NTIT_';
    const label = `${prefix}${value}`;
    onIssueTypeSelect(label);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Select Issue Type ({wasTested ? 'Tested' : 'Not Tested'}):
      </h3>
      <ul className="space-y-2">
        {issueTypes.map((issue) => (
          <li key={issue.value} className="flex items-center">
            <input
              type="radio"
              id={issue.value}
              name="issueType"
              value={issue.value}
              checked={selectedIssueType === issue.value}
              onChange={() => handleSelection(issue.value)}
              className="mr-2"
            />
            <label htmlFor={issue.value} className="cursor-pointer">
              {issue.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueTypeSelector;
