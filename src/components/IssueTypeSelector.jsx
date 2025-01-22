// IssueTypeSelector.jsx
import React, { useState } from "react";

const IssueTypeSelector = ({ isTested, onLabelSelect }) => {
  const [issueType, setIssueType] = useState("");
  const [label, setLabel] = useState("");

  const handleIssueTypeChange = (type) => {
    setIssueType(type);
    setLabel(""); // Reset label on issue type change
  };

  const handleLabelSelect = (selectedLabel) => {
    setLabel(selectedLabel);
    onLabelSelect(selectedLabel);
  };

  const renderLabelOptions = () => {
    if (isTested) {
      switch (issueType) {
        case "Correct Behavior (CB)":
          return <p>Label: CB</p>;
        case "Changes/Improvements/Clarifications (QCR)":
          return <p>Label: QCR</p>;
        case "Issue":
          return (
            <div>
              <p>Determine timing of issue:</p>
              <button onClick={() => handleLabelSelect("RB_CP")}>RB_CP (Code Problem)</button>
              <button onClick={() => handleLabelSelect("RB_CI")}>RB_CI (Configuration Issue)</button>
              <button onClick={() => handleLabelSelect("RDIP")}>RDIP (During Impl Process)</button>
              <button onClick={() => handleLabelSelect("CNBFR")}>CNBFR (Could Not Be Found)</button>
              <button onClick={() => handleLabelSelect("MP_THPS")}>MP_THPS (Third-party Service)</button>
              <button onClick={() => handleLabelSelect("MP_CP")}>MP_CP (Code Problem)</button>
              <button onClick={() => handleLabelSelect("MP_CI")}>MP_CI (Configuration Issue)</button>
            </div>
          );
        default:
          return null;
      }
    } else {
      switch (issueType) {
        case "Correct Behavior (CB)":
          return <p>Label: NTIT_CB</p>;
        case "Changes/Improvements/Clarifications (QCR)":
          return <p>Label: NTIT_QCR</p>;
        case "Issue":
          return (
            <div>
              <p>Determine if problem could have been found:</p>
              <button onClick={() => handleLabelSelect("NTIT_CNBFR")}>NTIT_CNBFR (Could Not Be Found)</button>
              <button onClick={() => handleLabelSelect("NTIT_CP")}>NTIT_CP (Code Problem)</button>
              <button onClick={() => handleLabelSelect("NTIT_TC")}>NTIT_TC (Test Cases Needed)</button>
              <button onClick={() => handleLabelSelect("NTIT_CI")}>NTIT_CI (Configuration Issue)</button>
              <button onClick={() => handleLabelSelect("NTIT_THPS")}>NTIT_THPS (Third-party Service)</button>
            </div>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div>
      <h3>Select Issue Type:</h3>
      <div>
        <label>
          <input
            type="radio"
            name="issueType"
            value="Correct Behavior (CB)"
            onChange={() => handleIssueTypeChange("Correct Behavior (CB)")}
          />
          Correct Behavior (CB)
        </label>
        <label>
          <input
            type="radio"
            name="issueType"
            value="Changes/Improvements/Clarifications (QCR)"
            onChange={() => handleIssueTypeChange("Changes/Improvements/Clarifications (QCR)")}
          />
          Changes/Improvements/Clarifications (QCR)
        </label>
        <label>
          <input
            type="radio"
            name="issueType"
            value="Issue"
            onChange={() => handleIssueTypeChange("Issue")}
          />
          Issue
        </label>
      </div>
      {renderLabelOptions()}
    </div>
  );
};

export default IssueTypeSelector;
