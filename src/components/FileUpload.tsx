import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
    );

    if (excelFile) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        onFileUpload(excelFile);
        setIsUploading(false);
      }, 1500);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        onFileUpload(file);
        setIsUploading(false);
      }, 1500);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Processing your file...</p>
              <div className="w-48 h-2 mx-auto bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200 ${
              isDragOver ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <Upload className={`w-8 h-8 transition-colors duration-200 ${
                isDragOver ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop your Excel file here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse • Supports .xlsx, .xls, .csv
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center text-xs text-gray-400">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>Files are processed locally and never uploaded to servers</span>
        </div>
      </div>
    </div>
  );
};