# Excel SQL Analyzer

A modern React TypeScript application that provides an AI-powered interface for analyzing Excel data and generating SQL queries through natural language chat.

## 🚀 Features

### Core Functionality
- **File Upload & Management**: Drag-and-drop Excel file upload with support for `.xlsx`, `.xls`, and `.csv` formats
- **AI Chat Interface**: Natural language conversation with an AI assistant to analyze data
- **SQL Query Generation**: Automatic generation of SQL queries based on user requests
- **Query Management**: Copy, download, and manage generated SQL queries
- **Responsive Design**: Mobile-friendly interface with tabbed navigation

### Technical Features
- **Modern React**: Built with React 18 and TypeScript
- **Vite Build System**: Fast development and optimized production builds
- **Tailwind CSS**: Modern, utility-first CSS framework
- **Lucide Icons**: Beautiful, consistent iconography
- **ESLint**: Code quality and consistency
- **PostCSS**: Advanced CSS processing

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx      # AI chat interface with SQL generation
│   │   ├── FileManager.tsx        # File list and management component
│   │   ├── FileUpload.tsx         # Drag-and-drop file upload
│   │   └── SQLQueryPanel.tsx      # SQL query display and management
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles
│   └── vite-env.d.ts             # Vite type definitions
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
├── tsconfig.json                 # TypeScript configuration
└── tsconfig.app.json             # App-specific TypeScript config
```

## 🛠️ Components Overview

### App.tsx
- **Main Application Container**: Orchestrates the three main panels
- **State Management**: Manages files, SQL queries, and active tab state
- **Layout**: Responsive grid layout with mobile tab navigation
- **Statistics Dashboard**: Shows processed files, generated queries, and ready files

### ChatInterface.tsx
- **AI Chat System**: Natural language conversation interface
- **SQL Generation**: Intelligent SQL query generation based on user input
- **Message History**: Persistent chat history with user and bot messages
- **Auto-scroll**: Automatic scrolling to latest messages
- **Typing Indicators**: Visual feedback during AI processing

### FileUpload.tsx
- **Drag-and-Drop**: Intuitive file upload with visual feedback
- **File Validation**: Supports Excel and CSV formats
- **Upload Progress**: Visual progress indicators during file processing
- **Error Handling**: Graceful error handling for invalid files

### FileManager.tsx
- **File List**: Displays uploaded files with status indicators
- **File Information**: Shows file size, upload date, and processing status
- **File Actions**: Remove files and view processing progress
- **Status Tracking**: Real-time status updates (analyzing, ready, error)

### SQLQueryPanel.tsx
- **Query Display**: Syntax-highlighted SQL query presentation
- **Query Actions**: Copy to clipboard, download, and execute options
- **Query History**: Persistent storage of generated queries
- **Metadata**: Timestamps and descriptions for each query

## 🎨 UI/UX Features

### Design System
- **Modern Interface**: Clean, professional design with subtle shadows and borders
- **Color Scheme**: Blue and purple gradient accents with gray backgrounds
- **Typography**: Clear hierarchy with proper font weights and sizes
- **Icons**: Consistent Lucide React icons throughout the interface

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch-friendly interactions
- **Tab Navigation**: Collapsible tab system for mobile screens
- **Grid Layout**: Responsive grid that adapts to screen size
- **Touch Targets**: Appropriately sized buttons and interactive elements

### Interactive Elements
- **Hover Effects**: Subtle hover states for buttons and cards
- **Loading States**: Animated progress indicators and loading spinners
- **Feedback**: Visual feedback for user actions (copy success, upload progress)
- **Transitions**: Smooth animations and transitions throughout the interface

## 🔧 Technical Implementation

### State Management
- **React Hooks**: Uses useState for local component state
- **Props Drilling**: Clean prop passing between components
- **Event Handlers**: Centralized event handling in App component

### Data Flow
1. **File Upload**: Files uploaded through FileUpload component
2. **Processing**: Files processed and status updated in App state
3. **Chat Interaction**: User messages trigger SQL generation in ChatInterface
4. **Query Storage**: Generated queries stored in App state and displayed in SQLQueryPanel

### SQL Generation Logic
The application includes predefined SQL scenarios that match user input:
- **Data Selection**: "SELECT * FROM user_data ORDER BY created_date DESC"
- **Counting Records**: "SELECT COUNT(*) as total_records FROM user_data WHERE status = 'active'"
- **Averages**: "SELECT AVG(amount) as average_amount FROM user_data WHERE amount > 0"
- **Grouping**: "SELECT category, COUNT(*) as count, SUM(amount) as total FROM user_data GROUP BY category"
- **Duplicate Detection**: "SELECT email, COUNT(*) as duplicates FROM user_data GROUP BY email HAVING COUNT(*) > 1"

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Groq API key (free tier available at https://console.groq.com/)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd project

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Groq API key

# Start development server
npm run dev
```

### Environment Setup
Create a `.env` file in the project root with your Groq API key:
```bash
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📱 Usage

1. **Upload Files**: Drag and drop Excel files or click to browse
2. **Chat with AI**: Ask questions about your data in natural language
3. **Generate Queries**: The AI will generate appropriate SQL queries
4. **Manage Queries**: Copy, download, or execute generated queries
5. **Track Progress**: Monitor file processing and query generation statistics

## 🛡️ Error Handling

- **File Validation**: Only accepts supported file formats
- **Upload Errors**: Graceful handling of upload failures
- **Network Issues**: Timeout handling for simulated API calls
- **User Feedback**: Clear error messages and status indicators

## 🔮 Future Enhancements

- **Real Database Integration**: Connect to actual databases for query execution
- **Advanced AI**: Integration with more sophisticated AI models
- **Data Visualization**: Charts and graphs for query results
- **Export Options**: Additional export formats (PDF, Excel)
- **User Authentication**: Multi-user support with authentication
- **Query Templates**: Pre-built query templates for common scenarios

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ using React, TypeScript, and Vite**
# botcase
