import React from 'react';

const RootCauseSelector = ({ wasTested, onLabelAssign, selectedIssueType }) => {
  const rootCauses = [
    { label: 'Code Problem', value: 'CP' },
    { label: 'Configuration Issue', value: 'CI' },
    { label: 'Third-Party Service', value: 'THPS' },
    { label: 'Restrictions', value: 'CNBFR' },
    { label: 'Documentation/Test Cases Update Needed', value: 'TC' },
  ];

  const handleSelection = (value) => {
    const prefix = wasTested ? '' : 'NTIT_';
    const label = `${prefix}${value}`;
    onLabelAssign(label);
  };

  if (selectedIssueType !== 'Issue') {
    return null; // Only render RootCauseSelector if the issue type is "Issue"
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Select Root Cause ({wasTested ? 'Tested' : 'Not Tested'}):
      </h3>
      <ul className="space-y-2">
        {rootCauses.map((cause) => (
          <li key={cause.value} className="flex items-center">
            <input
              type="radio"
              id={cause.value}
              name="rootCause"
              value={cause.value}
              onChange={() => handleSelection(cause.value)}
              className="mr-2"
            />
            <label htmlFor={cause.value} className="cursor-pointer">
              {cause.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RootCauseSelector;