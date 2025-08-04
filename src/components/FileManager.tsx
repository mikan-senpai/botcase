import React from 'react';
import { FileSpreadsheet, Calendar, HardDrive, MoreVertical } from 'lucide-react';

interface FileInfo {
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'analyzing' | 'ready' | 'error';
}

interface FileManagerProps {
  files: FileInfo[];
  onFileRemove: (fileName: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ files, onFileRemove }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Your Files</h3>
        <span className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>
      
      {files.map((file, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              file.status === 'ready' ? 'bg-green-100' :
              file.status === 'analyzing' ? 'bg-blue-100' : 'bg-red-100'
            }`}>
              <FileSpreadsheet className={`w-6 h-6 ${
                file.status === 'ready' ? 'text-green-600' :
                file.status === 'analyzing' ? 'text-blue-600' : 'text-red-600'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  file.status === 'ready' ? 'bg-green-100 text-green-800' :
                  file.status === 'analyzing' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {file.status === 'ready' ? 'Ready' :
                   file.status === 'analyzing' ? 'Analyzing...' : 'Error'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <HardDrive className="w-4 h-4" />
                  <span>{formatFileSize(file.size)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onFileRemove(file.name)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          {file.status === 'analyzing' && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '65%' }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};