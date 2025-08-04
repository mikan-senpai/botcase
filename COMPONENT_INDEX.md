# Component Index - Excel SQL Analyzer

## 📋 Quick Reference

| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| `App` | `src/App.tsx` | Main container | None |
| `ChatInterface` | `src/components/ChatInterface.tsx` | AI chat system | `onSQLGenerated` |
| `FileManager` | `src/components/FileManager.tsx` | File list management | `files`, `onFileRemove` |
| `FileUpload` | `src/components/FileUpload.tsx` | File upload interface | `onFileUpload` |
| `SQLQueryPanel` | `src/components/SQLQueryPanel.tsx` | SQL query management | `queries` |

---

## 🧩 Component Details

### App.tsx
**Location**: `src/App.tsx`
**Type**: Main Container Component
**Lines**: 188 lines

**Responsibilities:**
- Application state management
- Layout orchestration
- Event handler coordination
- Statistics tracking

**Key State:**
```typescript
const [files, setFiles] = useState<FileInfo[]>([]);
const [sqlQueries, setSqlQueries] = useState<SQLQuery[]>([]);
const [activeTab, setActiveTab] = useState<'upload' | 'chat' | 'queries'>('upload');
```

**Event Handlers:**
- `handleFileUpload(file: File)` - Processes uploaded files
- `handleFileRemove(fileName: string)` - Removes files from state
- `handleSQLGenerated(query: string, description: string)` - Stores generated SQL queries

**Layout Structure:**
- Header with branding and status
- Mobile tab navigation
- Three-panel desktop layout (Files, Chat, SQL Queries)
- Statistics footer

---

### ChatInterface.tsx
**Location**: `src/components/ChatInterface.tsx`
**Type**: Chat System Component
**Lines**: 221 lines

**Props:**
```typescript
interface ChatInterfaceProps {
  onSQLGenerated: (query: string, description: string) => void;
}
```

**Responsibilities:**
- Message history management
- SQL query generation
- User input handling
- Auto-scrolling to latest messages

**Key Features:**
- Natural language processing
- Predefined SQL scenarios
- Typing indicators
- Message persistence

**State:**
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [inputValue, setInputValue] = useState('');
const [isTyping, setIsTyping] = useState(false);
```

**SQL Generation Scenarios:**
1. **Data Selection**: "select", "all", "data", "records"
2. **Counting**: "count", "total", "number"
3. **Averages**: "average", "avg", "mean"
4. **Grouping**: "group", "category", "breakdown"
5. **Duplicates**: "duplicate", "duplicate records"

**Usage:**
```typescript
<ChatInterface onSQLGenerated={handleSQLGenerated} />
```

---

### FileUpload.tsx
**Location**: `src/components/FileUpload.tsx`
**Type**: Upload Interface Component
**Lines**: 114 lines

**Props:**
```typescript
interface FileUploadProps {
  onFileUpload: (file: File) => void;
}
```

**Responsibilities:**
- Drag-and-drop file handling
- File validation
- Upload progress simulation
- Visual feedback

**Supported Formats:**
- `.xlsx` - Excel 2007+ format
- `.xls` - Legacy Excel format
- `.csv` - Comma-separated values

**Key Features:**
- Visual drag-over feedback
- File type validation
- Upload progress animation
- Error handling

**State:**
```typescript
const [isDragOver, setIsDragOver] = useState(false);
const [isUploading, setIsUploading] = useState(false);
```

**Event Handlers:**
- `handleDragOver` - Visual feedback on drag
- `handleDragLeave` - Remove drag feedback
- `handleDrop` - Process dropped files
- `handleFileSelect` - Process selected files

**Usage:**
```typescript
<FileUpload onFileUpload={handleFileUpload} />
```

---

### FileManager.tsx
**Location**: `src/components/FileManager.tsx`
**Type**: File Management Component
**Lines**: 106 lines

**Props:**
```typescript
interface FileManagerProps {
  files: FileInfo[];
  onFileRemove: (fileName: string) => void;
}
```

**Responsibilities:**
- File list display
- Status tracking
- File removal
- Progress visualization

**File Status Indicators:**
- **Analyzing**: Blue indicator with progress bar
- **Ready**: Green indicator
- **Error**: Red indicator

**Key Features:**
- File size formatting
- Date formatting
- Status badges
- Progress bars for analyzing files

**Utility Functions:**
- `formatFileSize(bytes: number)` - Converts bytes to human-readable format
- `formatDate(date: Date)` - Formats date for display

**Usage:**
```typescript
<FileManager files={files} onFileRemove={handleFileRemove} />
```

---

### SQLQueryPanel.tsx
**Location**: `src/components/SQLQueryPanel.tsx`
**Type**: Query Management Component
**Lines**: 111 lines

**Props:**
```typescript
interface SQLQueryPanelProps {
  queries: SQLQuery[];
}
```

**Responsibilities:**
- Query display with syntax highlighting
- Copy to clipboard functionality
- Query download
- Query history management

**Actions Available:**
- Copy query to clipboard
- Download query as SQL file
- Execute query (placeholder)
- View query metadata

**State:**
```typescript
const [copiedId, setCopiedId] = useState<string | null>(null);
```

**Key Features:**
- Syntax-highlighted SQL display
- Copy success feedback
- Download functionality
- Empty state handling

**Utility Functions:**
- `copyToClipboard(query: string, id: string)` - Copies query to clipboard
- `downloadQuery(query: string, description: string)` - Downloads query as file

**Usage:**
```typescript
<SQLQueryPanel queries={sqlQueries} />
```

---

## 🔄 Component Relationships

### Data Flow
```
App.tsx (State Container)
├── FileUpload.tsx → onFileUpload → App.tsx
├── FileManager.tsx ← files, onFileRemove ← App.tsx
├── ChatInterface.tsx → onSQLGenerated → App.tsx
└── SQLQueryPanel.tsx ← queries ← App.tsx
```

### Event Flow
1. **File Upload**: `FileUpload` → `App` → `FileManager`
2. **Chat Interaction**: `ChatInterface` → `App` → `SQLQueryPanel`
3. **File Removal**: `FileManager` → `App` → `FileManager` (re-render)

---

## 🎨 Styling Patterns

### Common Class Patterns
```typescript
// Card containers
"bg-white rounded-xl shadow-sm border border-gray-200 p-6"

// Buttons
"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

// Status indicators
"px-2 py-1 text-xs font-medium rounded-full"

// Icons
"w-5 h-5 text-gray-400 hover:text-gray-600"
```

### Responsive Design
- **Mobile**: Single column with tab navigation
- **Desktop**: Three-column grid layout
- **Breakpoints**: Tailwind's default responsive system

---

## 🛠️ Development Notes

### Component Best Practices
1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: All components have typed props interfaces
3. **Event Handlers**: Clean callback patterns for parent communication
4. **State Management**: Local state for component-specific data

### Common Patterns
- **Loading States**: Consistent loading indicators across components
- **Error Handling**: Graceful error states and user feedback
- **Empty States**: Helpful empty state messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Performance Considerations
- **Memoization**: Consider React.memo for expensive components
- **Event Debouncing**: Prevent excessive re-renders
- **State Updates**: Batch related state updates
- **Cleanup**: Proper cleanup in useEffect hooks

---

This component index provides a comprehensive reference for understanding the structure and relationships between all components in the Excel SQL Analyzer application.
