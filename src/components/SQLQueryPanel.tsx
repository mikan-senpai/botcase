import React, { useState } from 'react';
import { Copy, Play, Download, Code2 } from 'lucide-react';

interface SQLQuery {
  id: string;
  query: string;
  description: string;
  timestamp: Date;
}

interface SQLQueryPanelProps {
  queries: SQLQuery[];
}

export const SQLQueryPanel: React.FC<SQLQueryPanelProps> = ({ queries }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (query: string, id: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadQuery = (query: string, description: string) => {
    const content = `-- ${description}\n-- Generated on ${new Date().toLocaleString()}\n\n${query}`;
    const blob = new Blob([content], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (queries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Code2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No SQL queries generated yet</p>
        <p className="text-sm mt-2">Start chatting to generate queries from your data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Generated Queries</h3>
        <span className="text-sm text-gray-500">{queries.length} quer{queries.length !== 1 ? 'ies' : 'y'}</span>
      </div>
      
      {queries.map((queryItem) => (
        <div key={queryItem.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">SQL Query</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(queryItem.query, queryItem.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Copy query"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Execute query"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={() => downloadQuery(queryItem.query, queryItem.description)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                  title="Download query"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{queryItem.description}</p>
          </div>
          
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 p-4 text-sm font-mono overflow-x-auto">
              <code>{queryItem.query}</code>
            </pre>
            
            {copiedId === queryItem.id && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                Copied!
              </div>
            )}
          </div>
          
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
            Generated on {queryItem.timestamp.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};