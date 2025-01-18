import React from 'react'
import ReactDOM from 'react-dom/client'
import ProjectSelector from './components/ProjectSelector';
import EnvironmentSelector from './components/EnvironmentSelector'
// import { IssueTypeSelector } from './components/IssueTypeSelector'
// import { TimeSelector } from './components/TimeSelector'
// import { RootCauseSelector } from './components/RootCauseSelector'

// Main App Component
function App() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Inquiry Decision Maker
        </h1>
        <p className="text-gray-600">
          QA Team Analysis Tool
        </p>
      </header>

      <main className="space-y-6">
        {/* Components will be added here as we create them */}
        <div className="space-y-4 bg-white shadow-sm rounded-lg p-6">
          {/* Initial placeholder for our workflow */}
          <p className="text-gray-700">
            Loading workflow components...
          </p>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Internal QA Tool - 2025</p>
      </footer>
    </div>
  )
}

// Mount the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)