import React, { useState } from 'react';

const IssueTypeSelector = ({ onIssueTypeSelect }) => {
  const [selectedIssueType, setSelectedIssueType] = useState('');

  const issueTypes = [
    { label: 'Correct Behavior (CB)', value: 'CB' },
    { label: 'Changes/Improvements/Clarifications (QCR)', value: 'QCR' },
    { label: 'Issue', value: 'Issue' },
  ];

  const handleSelection = (type) => {
    setSelectedIssueType(type);
    onIssueTypeSelect(type);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Issue Type:</h3>
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
