# Running Resume Analyzer in VS Code

## Prerequisites
- Node.js (v16 or higher)
- VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer

## Setup Steps

### 1. Create New Project
```bash
mkdir resume-analyzer
cd resume-analyzer
```

### 2. Initialize Project
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### 3. Install Dependencies
```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Copy Project Files
Copy all the source files from this project to your new VS Code project.

### 5. Run the Application

**Terminal 1 - Backend Server:**
```bash
node server.js
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

## VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **TypeScript Importer** - Auto import TypeScript modules
- **Prettier** - Code formatting
- **ESLint** - Code linting

## Running in VS Code

1. **Open integrated terminal** (Ctrl+`)
2. **Split terminal** (click the split icon)
3. **Run backend** in first terminal: `node server.js`
4. **Run frontend** in second terminal: `npm run dev`
5. **Open browser** to `http://localhost:5173`

## File Structure
```
resume-analyzer/
├── src/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── App.tsx
├── server.js
├── package.json
└── README.md
```

## Debugging in VS Code

1. **Install debugger** extension for Node.js
2. **Create launch.json** for debugging
3. **Set breakpoints** in your code
4. **Use VS Code debugger** to step through code

## Tips for VS Code Development

- Use **Ctrl+Shift+P** for command palette
- **Ctrl+`** to toggle terminal
- **Ctrl+B** to toggle sidebar
- **F5** to start debugging
- **Ctrl+Shift+E** for file explorer