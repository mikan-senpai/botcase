import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { FileManager } from './components/FileManager';
import { ChatInterface } from './components/ChatInterface';
import { SQLQueryPanel } from './components/SQLQueryPanel';
import { ExcelDocumentParser } from './components/ExcelDocumentParser';
import { KnowledgeViewer } from './components/KnowledgeViewer';
import { Database, MessageSquare, FileText, Sparkles, BookOpen, Brain } from 'lucide-react';
import { ParsedKnowledge } from './services/GroqService';

interface FileInfo {
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'analyzing' | 'ready' | 'error';
}

interface SQLQuery {
  id: string;
  query: string;
  description: string;
  timestamp: Date;
}

function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [sqlQueries, setSqlQueries] = useState<SQLQuery[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'chat' | 'queries' | 'knowledge' | 'parser'>('upload');
  const [knowledge, setKnowledge] = useState<ParsedKnowledge | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    const newFile: FileInfo = {
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: 'analyzing'
    };

    setFiles(prev => [...prev, newFile]);

    // Simulate file processing
    setTimeout(() => {
      setFiles(prev =>
        prev.map(f =>
          f.name === file.name ? { ...f, status: 'ready' as const } : f
        )
      );
    }, 3000);
  };

  const handleFileRemove = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSQLGenerated = (query: string, description: string) => {
    const newQuery: SQLQuery = {
      id: Date.now().toString(),
      query,
      description,
      timestamp: new Date()
    };
    setSqlQueries(prev => [...prev, newQuery]);
  };

  const handleKnowledgeParsed = (parsedKnowledge: ParsedKnowledge) => {
    setKnowledge(parsedKnowledge);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const tabs = [
    { id: 'upload' as const, label: 'Files', icon: FileText },
    { id: 'parser' as const, label: 'Document Parser', icon: BookOpen },
    { id: 'knowledge' as const, label: 'Knowledge Base', icon: Brain },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'queries' as const, label: 'SQL Queries', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Excel SQL Analyzer</h1>
                <p className="text-sm text-gray-500">Transform your data into insights</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Panel - Files */}
          <div className={`lg:block ${activeTab === 'upload' ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Upload Data
              </h2>

              {files.length === 0 ? (
                <FileUpload onFileUpload={handleFileUpload} />
              ) : (
                <div className="space-y-6">
                  <FileUpload onFileUpload={handleFileUpload} />
                  <FileManager files={files} onFileRemove={handleFileRemove} />
                </div>
              )}
            </div>
          </div>

          {/* Document Parser Panel */}
          <div className={`lg:block ${activeTab === 'parser' ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Document Parser
              </h2>

              <ExcelDocumentParser
                onKnowledgeParsed={handleKnowledgeParsed}
                onError={handleError}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Knowledge Base Panel */}
          <div className={`lg:block ${activeTab === 'knowledge' ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Knowledge Base
              </h2>

              {knowledge ? (
                <KnowledgeViewer knowledge={knowledge} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No knowledge base loaded</p>
                  <p className="text-sm mt-2">Upload a document in the Document Parser tab to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Chat */}
          <div className={`lg:block ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] lg:h-[700px] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ask questions about your data to generate SQL queries
                </p>
              </div>

              <div className="flex-1 min-h-0">
                <ChatInterface onSQLGenerated={handleSQLGenerated} />
              </div>
            </div>
          </div>

          {/* Right Panel - SQL Queries */}
          <div className={`lg:block ${activeTab === 'queries' ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Generated SQL
              </h2>

              <SQLQueryPanel queries={sqlQueries} />
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{files.length}</div>
            <div className="text-sm text-gray-500">Files Processed</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{sqlQueries.length}</div>
            <div className="text-sm text-gray-500">Queries Generated</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {files.filter(f => f.status === 'ready').length}
            </div>
            <div className="text-sm text-gray-500">Ready for Analysis</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {knowledge ? knowledge.tableSpecifications.length : 0}
            </div>
            <div className="text-sm text-gray-500">Tables Parsed</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {knowledge ? knowledge.testScenarios.length : 0}
            </div>
            <div className="text-sm text-gray-500">Test Scenarios</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
