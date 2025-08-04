import Groq from 'groq-sdk';

export interface ParsedKnowledge {
  tableSpecifications: TableSpecification[];
  functionalRequirements: FunctionalRequirement[];
  businessRules: BusinessRule[];
  testScenarios: TestScenario[];
}

export interface TableSpecification {
  tableName: string;
  columns: ColumnDefinition[];
  constraints: Constraint[];
  relationships: Relationship[];
}

export interface ColumnDefinition {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  description?: string;
  constraints?: string[];
}

export interface Constraint {
  name: string;
  type: 'PRIMARY_KEY' | 'FOREIGN_KEY' | 'UNIQUE' | 'CHECK';
  columns: string[];
  reference?: string;
}

export interface Relationship {
  fromTable: string;
  toTable: string;
  fromColumn: string;
  toColumn: string;
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
}

export interface FunctionalRequirement {
  id: string;
  description: string;
  businessLogic: string;
  transformations: DataTransformation[];
}

export interface DataTransformation {
  name: string;
  description: string;
  sqlLogic: string;
  conditions: string[];
}

export interface BusinessRule {
  id: string;
  rule: string;
  sqlCondition: string;
  validationType: 'CHECK' | 'TRIGGER' | 'PROCEDURE';
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  testQueries: SQLQuery[];
  expectedResults: string;
}

export interface SQLQuery {
  id: string;
  query: string;
  description: string;
  category: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'VALIDATION';
  testScenario?: string;
}

class GroqService {
  private groq: Groq;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.VITE_GROQ_API_KEY || '';
    this.groq = new Groq({
      apiKey: this.apiKey,
    });
  }

  async parseExcelWorkbook(workbookData: any): Promise<ParsedKnowledge> {
    try {
      const workbookText = this.convertWorkbookToText(workbookData);

      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a SQL expert and data analyst. Parse this Excel workbook and extract:
            1. Table specifications (column names, data types, constraints)
            2. Functional requirements and business rules
            3. Data transformation rules
            4. Test scenarios and validation rules

            Return the analysis in JSON format with the following structure:
            {
              "tableSpecifications": [...],
              "functionalRequirements": [...],
              "businessRules": [...],
              "testScenarios": [...]
            }`
          },
          {
            role: "user",
            content: `Analyze this Excel workbook:\n\n${workbookText}`
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.1,
        max_tokens: 4000,
      });

      const result = response.choices[0].message.content;
      return this.parseGroqResponse(result);
    } catch (error) {
      console.error('Error parsing Excel workbook with Groq:', error);
      throw new Error('Failed to parse Excel workbook');
    }
  }

  async generateQueries(
    knowledge: ParsedKnowledge,
    userRequest: string,
    uploadedData?: any
  ): Promise<SQLQuery[]> {
    try {
      const context = this.buildContext(knowledge, uploadedData);

      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a SQL expert. Based on the provided knowledge base, generate SQL queries for the user's request.
            Consider the table specifications, business rules, and functional requirements.

            Return queries in JSON format:
            [
              {
                "id": "unique_id",
                "query": "SQL_QUERY",
                "description": "What this query does",
                "category": "SELECT|INSERT|UPDATE|DELETE|VALIDATION"
              }
            ]`
          },
          {
            role: "user",
            content: `Knowledge Base:\n${context}\n\nUser Request: ${userRequest}`
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.2,
        max_tokens: 2000,
      });

      const result = response.choices[0].message.content;
      return this.parseQueryResponse(result);
    } catch (error) {
      console.error('Error generating queries with Groq:', error);
      throw new Error('Failed to generate queries');
    }
  }

  async generateTestScenarios(knowledge: ParsedKnowledge): Promise<TestScenario[]> {
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a QA expert. Based on the provided knowledge base, generate comprehensive test scenarios.
            Include data validation, business rule testing, and edge cases.

            Return test scenarios in JSON format:
            [
              {
                "id": "unique_id",
                "name": "Test Scenario Name",
                "description": "What this test validates",
                "testQueries": [...],
                "expectedResults": "Expected outcome"
              }
            ]`
          },
          {
            role: "user",
            content: `Generate test scenarios for this knowledge base:\n${JSON.stringify(knowledge, null, 2)}`
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.3,
        max_tokens: 3000,
      });

      const result = response.choices[0].message.content;
      return this.parseTestScenarioResponse(result);
    } catch (error) {
      console.error('Error generating test scenarios with Groq:', error);
      throw new Error('Failed to generate test scenarios');
    }
  }

  private convertWorkbookToText(workbookData: any): string {
    // Convert Excel workbook data to text format for LLM processing
    let text = '';

    if (workbookData.SheetNames) {
      text += `Workbook contains ${workbookData.SheetNames.length} sheets:\n`;
      workbookData.SheetNames.forEach((sheetName: string) => {
        text += `\nSheet: ${sheetName}\n`;
        const sheet = workbookData.Sheets[sheetName];
        if (sheet) {
          text += this.convertSheetToText(sheet);
        }
      });
    }

    return text;
  }

  private convertSheetToText(sheet: any): string {
    let text = '';
    const range = sheet['!ref'];
    if (range) {
      const [start, end] = range.split(':');
      const startCol = this.getColumnIndex(start.match(/[A-Z]+/)[0]);
      const startRow = parseInt(start.match(/\d+/)[0]);
      const endCol = this.getColumnIndex(end.match(/[A-Z]+/)[0]);
      const endRow = parseInt(end.match(/\d+/)[0]);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const cellAddress = this.getColumnLetter(col) + row;
          const cell = sheet[cellAddress];
          if (cell && cell.v !== undefined) {
            text += `${cell.v}\t`;
          }
        }
        text += '\n';
      }
    }
    return text;
  }

  private getColumnIndex(columnLetter: string): number {
    let index = 0;
    for (let i = 0; i < columnLetter.length; i++) {
      index = index * 26 + (columnLetter.charCodeAt(i) - 64);
    }
    return index;
  }

  private getColumnLetter(index: number): string {
    let letter = '';
    while (index > 0) {
      index--;
      letter = String.fromCharCode(65 + (index % 26)) + letter;
      index = Math.floor(index / 26);
    }
    return letter;
  }

  private buildContext(knowledge: ParsedKnowledge, uploadedData?: any): string {
    let context = 'Knowledge Base:\n';

    // Add table specifications
    context += '\nTable Specifications:\n';
    knowledge.tableSpecifications.forEach(table => {
      context += `- Table: ${table.tableName}\n`;
      table.columns.forEach(col => {
        context += `  - ${col.name}: ${col.dataType}${col.isPrimaryKey ? ' (PK)' : ''}${col.isNullable ? ' (nullable)' : ''}\n`;
      });
    });

    // Add business rules
    context += '\nBusiness Rules:\n';
    knowledge.businessRules.forEach(rule => {
      context += `- ${rule.rule}: ${rule.sqlCondition}\n`;
    });

    // Add functional requirements
    context += '\nFunctional Requirements:\n';
    knowledge.functionalRequirements.forEach(req => {
      context += `- ${req.description}: ${req.businessLogic}\n`;
    });

    if (uploadedData) {
      context += '\nUploaded Data Sample:\n';
      context += JSON.stringify(uploadedData.slice(0, 5), null, 2);
    }

    return context;
  }

  private parseGroqResponse(response: string): ParsedKnowledge {
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                       response.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, response];

      const jsonString = jsonMatch[1] || response;
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing Groq response:', error);
      throw new Error('Invalid response format from Groq');
    }
  }

  private parseQueryResponse(response: string): SQLQuery[] {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                       response.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, response];

      const jsonString = jsonMatch[1] || response;
      const queries = JSON.parse(jsonString);

      return queries.map((query: any, index: number) => ({
        id: query.id || `query_${Date.now()}_${index}`,
        query: query.query,
        description: query.description,
        category: query.category || 'SELECT',
        timestamp: new Date()
      }));
    } catch (error) {
      console.error('Error parsing query response:', error);
      throw new Error('Invalid query response format');
    }
  }

  private parseTestScenarioResponse(response: string): TestScenario[] {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                       response.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, response];

      const jsonString = jsonMatch[1] || response;
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing test scenario response:', error);
      throw new Error('Invalid test scenario response format');
    }
  }
}

export default new GroqService();
