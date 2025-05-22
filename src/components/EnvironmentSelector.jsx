import React from 'react';

export const EnvironmentSelector = ({ onEnvironmentChange, onVersionChange }) => {
  const environments = ['DEV', 'TEST', 'LIVETEST', 'PROD'];
  const versions = ['3.41/4.41', '5.5','5.6','5.7','5.8','5.9','5.10','5.11','5.12'];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Select Environment and Version</h2>
      
      {/* Environment Selector */}
      <div className="mb-4">
        <label htmlFor="environment" className="block text-sm font-medium mb-1">
          Environment:
        </label>
        <select
          id="environment"
          className="border rounded p-2 w-full"
          onChange={(e) => onEnvironmentChange(e.target.value)}
        >
          <option value="">Select Environment</option>
          {environments.map((env) => (
            <option key={env} value={env}>
              {env}
            </option>
          ))}
        </select>
      </div>

      {/* Version Selector */}
      <div>
        <label htmlFor="version" className="block text-sm font-medium mb-1">
          Version:
        </label>
        <select
          id="version"
          className="border rounded p-2 w-full"
          onChange={(e) => onVersionChange(e.target.value)}
        >
          <option value="">Select Version</option>
          {versions.map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EnvironmentSelector;