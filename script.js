function toggleSections() {
    const selectedName = document.getElementById('nameSelect').value;
    document.getElementById('startButton').style.display = 'none';

    if (selectedName === "not_tested") {
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step3_not_tested').style.display = 'block';
    } else {
        document.getElementById('step3_not_tested').style.display = 'none';
        if (selectedName) {
            document.getElementById('step3').style.display = 'block';
            document.getElementById('step4').style.display = 'none';
        } else {
            document.getElementById('step3').style.display = 'none';
            document.getElementById('step4').style.display = 'none';
        }
    }
}

function checkIssueType() {
    const issueType = document.getElementById('issueType').value;

    if (issueType === 'issue') {
        document.getElementById('step3_3').style.display = 'block';
    } else {
        document.getElementById('step3_3').style.display = 'none';
        document.getElementById('rootCauseOptions').style.display = 'none';
    }
}

function checkCreationTime() {
    const creationTime = document.getElementById('creationTime').value;

    if (creationTime === 'reported') {
        document.getElementById('rootCauseOptions').style.display = 'block';
        document.getElementById('afterTestingOptions').style.display = 'none'; 
    } else if (creationTime === 'after_testing') {
        document.getElementById('afterTestingOptions').style.display = 'block';
        document.getElementById('rootCauseOptions').style.display = 'none';
    } else {
        document.getElementById('rootCauseOptions').style.display = 'none'; 
        document.getElementById('afterTestingOptions').style.display = 'none'; 
    }
}

function handleAfterTesting() {
    const afterTestingValue = document.getElementById('afterTestingSelect').value;

    if (afterTestingValue === 'could_not_be_found') {
        displayResults(['CNBFR']);
        document.getElementById('afterTestingOptions').style.display = 'none';
    } else if (afterTestingValue === 'could_be_found') {
        document.getElementById('thirdPartyServiceOptions').style.display = 'block';
    }
}

function handleThirdParty() {
    const thirdPartyValue = document.getElementById('thirdPartySelect').value;
    const step3NextButton = document.getElementById('step3NextButton');

    if (thirdPartyValue === 'yes') {
        displayResults(['MP_THPS']);
        document.getElementById('thirdPartyServiceOptions').style.display = 'none';
        step3NextButton.style.display = 'block';
    } else if (thirdPartyValue === 'no') {
        document.getElementById('rootCauseDetailOptions').style.display = 'block';
        step3NextButton.style.display = 'none';
    }
}

function processRootCauseDetail() {
    const rootCauseDetailValue = document.querySelector('input[name="rootCauseDetail"]:checked');
    let results = [];

    if (rootCauseDetailValue) {
        if (rootCauseDetailValue.value === 'code_problem') {
            results.push('MP_CP');
        } else if (rootCauseDetailValue.value === 'configuration_issue') {
            results.push('MP_CI');
        }
    }

    displayResults(results);
    document.getElementById('rootCauseDetailOptions').style.display = 'none';
}

function handleNotTested() {
    const notTestedValue = document.getElementById('notTestedSelect').value;

    if (notTestedValue === "fad") {
        displayResults(['NTIT_CB']);
    } else if (notTestedValue === "changes") {
        displayResults(['NTIT_QCR']);
    } else if (notTestedValue === "issue") {
        document.getElementById('issueFollowUpOptions').style.display = 'block';
    }
}

function processIssueFollowUp() {
    const issueFollowUpValue = document.querySelector('input[name="issueFollowUp"]:checked').value;
    let results = [];
    
    if (issueFollowUpValue === "could_not_be_found") {
        results.push('NTIT_CNBFR');
    } else if (issueFollowUpValue === "could_be_found") {
        document.getElementById('issueFollowUpDetails').style.display = 'block';
    }

    displayResults(results);
}

function handleIssueFollowUpDetail() {
    const issueFollowUpDetailValue = document.querySelector('input[name="issueFollowUpDetail"]:checked').value;
    let results = [];

    const resultMap = {
        "code_problem": 'NTIT_CP',
        "lack_of_documentation": 'NTIT_TC',
        "configuration_issue": 'NTIT_CI',
        "third_party_service": 'NTIT_THPS'
    };

    if (resultMap[issueFollowUpDetailValue]) {
        results.push(resultMap[issueFollowUpDetailValue]);
    }

    displayResults(results);
    document.getElementById('issueFollowUpDetails').style.display = 'none';
}

function processStep3() {
    const issueType = document.getElementById('issueType').value;
    const creationTime = document.getElementById('creationTime').value;
    let results = [];

    if (issueType === 'fad') {
        results.push('CB');
    } else if (issueType === 'changes') {
        results.push('QCR');
    } else if (issueType === 'issue' && creationTime === 'reported') {
        const rootCause = document.querySelector('input[name="rootCause"]:checked');
        if (rootCause) {
            const resultMap = {
                'code_problem': 'RB_CP',
                'configuration_issue': 'RB_CI',
                'impl_process': 'RDIP'
            };
            if (resultMap[rootCause.value]) {
                results.push(resultMap[rootCause.value]);
            }
        }
    }

    displayResults(results);
}

function processStep4() {
    const step4IssueType = document.getElementById('step4IssueType').value;
    let results = [];

    if (step4IssueType === 'fad') {
        results.push('NTIT_CB');
    } else if (step4IssueType === 'changes') {
        results.push('NTIT_QCR');
    }

    const step4Found = document.getElementById('step4Found').value;
    if (step4Found === 'not_found') {
        results.push('NTIT_CNBFR');
    }

    displayResults(results);
}

function displayResults(results) {
    const resultList = document.getElementById('result');
    resultList.innerHTML = '';
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result;
        resultList.appendChild(li);
    });

    const showInputSectionResults = ['CB', 'QCR', 'RB_CP', 'RB_CI', 'RDIP', 'CNBFR', 'MP_THPS', 'MP_CP', 'MP_CI', 'NTIT_CB', 'NTIT_QCR', 'NTIT_CNBFR', 'NTIT_CP', 'NTIT_TC', 'NTIT_CI', 'NTIT_THPS'];
    const showLinkAndText = results.some(result => showInputSectionResults.includes(result));

    document.getElementById('ticketLinkSection').style.display = showLinkAndText ? 'block' : 'none';
    document.getElementById('additionalText').style.display = showLinkAndText ? 'block' : 'none';
    if (!showLinkAndText) {
        document.getElementById('ticketLinkInput').value = '';
    }

    document.getElementById('recordLinkSection').style.display = results.length > 0 ? 'block' : 'none';
}

function copyToClipboard() {
    const resultItems = document.querySelectorAll('#result li');
    const resultsText = Array.from(resultItems).map(item => item.textContent).join('\n');
    const ticketLink = document.getElementById('ticketLinkInput').value || 'No Link';
    const additionalText = document.getElementById('additionalText').querySelector('textarea').value.trim() || 'No Additional Text';

    const tableHeader = 'Result\tTicket Link\tAdditional Info';
    let tableRows = resultsText.split('\n').map(result => {
        return `${result}\t${ticketLink}\t${additionalText}`;
    });

    const finalText = [tableHeader, ...tableRows].join('\n');

    navigator.clipboard.writeText(finalText).then(() => {
        alert("Copied to clipboard!");
    });
} 