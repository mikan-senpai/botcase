import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import GroqService, { ParsedKnowledge, TableSpecification, FunctionalRequirement, BusinessRule, TestScenario } from '../services/GroqService';

interface ExcelDocumentParserProps {
  onKnowledgeParsed: (knowledge: ParsedKnowledge) => void;
  onError: (error: string) => void;
}

interface ParsingStatus {
  isParsing: boolean;
  progress: number;
  currentStep: string;
  error?: string;
}

export const ExcelDocumentParser: React.FC<ExcelDocumentParserProps> = ({
  onKnowledgeParsed,
  onError
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [parsingStatus, setParsingStatus] = useState<ParsingStatus>({
    isParsing: false,
    progress: 0,
    currentStep: 'Ready to parse'
  });

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
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );

    if (excelFile) {
      await parseExcelFile(excelFile);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await parseExcelFile(file);
    }
  }, []);

  const parseExcelFile = async (file: File) => {
    try {
      setParsingStatus({
        isParsing: true,
        progress: 0,
        currentStep: 'Reading Excel file...'
      });

      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      setParsingStatus({
        isParsing: true,
        progress: 30,
        currentStep: 'Analyzing workbook structure...'
      });

      // Extract workbook information
      const workbookInfo = {
        SheetNames: workbook.SheetNames,
        Sheets: workbook.Sheets,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          sheetCount: workbook.SheetNames.length
        }
      };

      setParsingStatus({
        isParsing: true,
        progress: 60,
        currentStep: 'Sending to Groq for analysis...'
      });

      // Send to Groq for parsing
      const knowledge = await GroqService.parseExcelWorkbook(workbookInfo);

      setParsingStatus({
        isParsing: true,
        progress: 90,
        currentStep: 'Processing results...'
      });

      // Generate test scenarios
      const testScenarios = await GroqService.generateTestScenarios(knowledge);
      knowledge.testScenarios = testScenarios;

      setParsingStatus({
        isParsing: false,
        progress: 100,
        currentStep: 'Parsing complete!'
      });

      onKnowledgeParsed(knowledge);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      setParsingStatus({
        isParsing: false,
        progress: 0,
        currentStep: 'Error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      onError(error instanceof Error ? error.message : 'Failed to parse Excel file');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragOver
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${parsingStatus.isParsing ? 'pointer-events-none' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={parsingStatus.isParsing}
        />

        {parsingStatus.isParsing ? (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-900">Analyzing Excel Document...</p>
              <p className="text-sm text-gray-600">{parsingStatus.currentStep}</p>

              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${parsingStatus.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{parsingStatus.progress}% complete</p>
              </div>
            </div>
          </div>
        ) : parsingStatus.error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Parsing Failed</p>
              <p className="text-sm text-red-600">{parsingStatus.error}</p>
              <p className="text-sm text-gray-500">Try uploading a different Excel file</p>
            </div>
          </div>
        ) : parsingStatus.progress === 100 ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Document Parsed Successfully!</p>
              <p className="text-sm text-gray-500">Knowledge base has been extracted and is ready for use</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200 ${
              isDragOver ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <FileSpreadsheet className={`w-8 h-8 transition-colors duration-200 ${
                isDragOver ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Upload Excel Document for Analysis
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop your Excel workbook here or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supports .xlsx and .xls files with multiple sheets
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">What will be extracted:</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Table specifications and column definitions</li>
          <li>• Functional requirements and business rules</li>
          <li>• Data transformation logic</li>
          <li>• Test scenarios and validation rules</li>
          <li>• SQL query templates based on your specifications</li>
        </ul>
      </div>
    </div>
  );
};
