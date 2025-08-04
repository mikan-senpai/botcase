import React, { useState } from 'react';
import { Database, FileText, Shield, TestTube, ChevronDown, ChevronRight } from 'lucide-react';
import { ParsedKnowledge, TableSpecification, FunctionalRequirement, BusinessRule, TestScenario } from '../services/GroqService';

interface KnowledgeViewerProps {
  knowledge: ParsedKnowledge;
}

export const KnowledgeViewer: React.FC<KnowledgeViewerProps> = ({ knowledge }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tables: true,
    requirements: true,
    rules: true,
    scenarios: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderTableSpecifications = () => (
    <div className="space-y-4">
      {knowledge.tableSpecifications.map((table, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Database className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold text-gray-900">{table.tableName}</h4>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Columns:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {table.columns.map((column, colIndex) => (
                  <div key={colIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{column.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">{column.dataType}</span>
                      {column.isPrimaryKey && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">PK</span>
                      )}
                      {column.isNullable && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">NULL</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {table.constraints.length > 0 && (
              <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Constraints:</h5>
              <div className="space-y-1">
                {table.constraints.map((constraint, constraintIndex) => (
                  <div key={constraintIndex} className="text-xs text-gray-600">
                    <span className="font-medium">{constraint.name}:</span> {constraint.type} on {constraint.columns.join(', ')}
                  </div>
                ))}
              </div>
            </div>
            )}

            {table.relationships.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Relationships:</h5>
                <div className="space-y-1">
                  {table.relationships.map((rel, relIndex) => (
                    <div key={relIndex} className="text-xs text-gray-600">
                      {rel.fromTable}.{rel.fromColumn} → {rel.toTable}.{rel.toColumn} ({rel.type})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderFunctionalRequirements = () => (
    <div className="space-y-4">
      {knowledge.functionalRequirements.map((req, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-green-500" />
            <h4 className="font-semibold text-gray-900">{req.description}</h4>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Business Logic:</h5>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{req.businessLogic}</p>
            </div>

            {req.transformations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Data Transformations:</h5>
                <div className="space-y-2">
                  {req.transformations.map((transformation, transIndex) => (
                    <div key={transIndex} className="bg-blue-50 p-3 rounded">
                      <div className="font-medium text-sm text-blue-900">{transformation.name}</div>
                      <div className="text-xs text-blue-800 mt-1">{transformation.description}</div>
                      <div className="text-xs font-mono bg-blue-100 p-2 rounded mt-2">{transformation.sqlLogic}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderBusinessRules = () => (
    <div className="space-y-4">
      {knowledge.businessRules.map((rule, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-purple-500" />
            <h4 className="font-semibold text-gray-900">{rule.rule}</h4>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <span className="font-medium">SQL Condition:</span> {rule.sqlCondition}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Validation Type:</span>
              <span className={`px-2 py-1 text-xs rounded ${
                rule.validationType === 'CHECK' ? 'bg-blue-100 text-blue-800' :
                rule.validationType === 'TRIGGER' ? 'bg-orange-100 text-orange-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {rule.validationType}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTestScenarios = () => (
    <div className="space-y-4">
      {knowledge.testScenarios.map((scenario, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TestTube className="w-5 h-5 text-red-500" />
            <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Description:</h5>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Test Queries:</h5>
              <div className="space-y-2">
                {scenario.testQueries.map((query, queryIndex) => (
                  <div key={queryIndex} className="bg-gray-50 p-3 rounded">
                    <div className="text-xs font-medium text-gray-700 mb-1">{query.description}</div>
                    <div className="text-xs font-mono bg-gray-100 p-2 rounded">{query.query}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Expected Results:</h5>
              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">{scenario.expectedResults}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
        <div className="text-sm text-gray-500">
          {knowledge.tableSpecifications.length} tables • {knowledge.functionalRequirements.length} requirements • {knowledge.businessRules.length} rules • {knowledge.testScenarios.length} scenarios
        </div>
      </div>

      {/* Table Specifications */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          onClick={() => toggleSection('tables')}
          className="flex items-center space-x-2 w-full text-left"
        >
          {expandedSections.tables ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Database className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-900">Table Specifications ({knowledge.tableSpecifications.length})</span>
        </button>
        {expandedSections.tables && (
          <div className="mt-4">
            {renderTableSpecifications()}
          </div>
        )}
      </div>

      {/* Functional Requirements */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          onClick={() => toggleSection('requirements')}
          className="flex items-center space-x-2 w-full text-left"
        >
          {expandedSections.requirements ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <FileText className="w-5 h-5 text-green-500" />
          <span className="font-medium text-gray-900">Functional Requirements ({knowledge.functionalRequirements.length})</span>
        </button>
        {expandedSections.requirements && (
          <div className="mt-4">
            {renderFunctionalRequirements()}
          </div>
        )}
      </div>

      {/* Business Rules */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          onClick={() => toggleSection('rules')}
          className="flex items-center space-x-2 w-full text-left"
        >
          {expandedSections.rules ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <Shield className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-gray-900">Business Rules ({knowledge.businessRules.length})</span>
        </button>
        {expandedSections.rules && (
          <div className="mt-4">
            {renderBusinessRules()}
          </div>
        )}
      </div>

      {/* Test Scenarios */}
      <div className="bg-gray-50 rounded-lg p-4">
        <button
          onClick={() => toggleSection('scenarios')}
          className="flex items-center space-x-2 w-full text-left"
        >
          {expandedSections.scenarios ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <TestTube className="w-5 h-5 text-red-500" />
          <span className="font-medium text-gray-900">Test Scenarios ({knowledge.testScenarios.length})</span>
        </button>
        {expandedSections.scenarios && (
          <div className="mt-4">
            {renderTestScenarios()}
          </div>
        )}
      </div>
    </div>
  );
};
