// File: src/pages/App.tsx
import React, { useState } from 'react';
import FileTree from '../components/FileTree';
import ChatPanel from '../components/ChatPanel';
import CodeEditor from '../components/CodeEditor';
import PreviewPanel from '../components/PreviewPanel';
import FileGenerator from '../components/FileGenerator';
import ProjectRefactor from '../components/ProjectRefactor';
import { API_BASE } from '../api/config';

const App = () => {
  type OpenFile = { path: string; content: string };

  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [code, setCode] = useState('');

  const loadFile = async (path: string) => {
    const res = await fetch(`${API_BASE}/file?path=${encodeURIComponent(path)}`);
    const text = await res.text();

    const alreadyOpen = openFiles.find(f => f.path === path);
    if (!alreadyOpen) {
      setOpenFiles(prev => [...prev, { path, content: text }]);
    } else {
      setOpenFiles(prev =>
        prev.map(f => f.path === path ? { ...f, content: text } : f)
      );
    }
    setActiveFile(path);
    setCode(text);
  };

  const closeTab = (path: string) => {
    setOpenFiles(prev => prev.filter(f => f.path !== path));
    if (activeFile === path) {
      const fallback = openFiles.find(f => f.path !== path);
      if (fallback) {
        setActiveFile(fallback.path);
        setCode(fallback.content);
      } else {
        setActiveFile('');
        setCode('');
      }
    }
  };

  return (
    <div className="h-screen w-screen flex text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col space-y-6 shadow-lg">
        <h1 className="text-xl font-bold text-indigo-700">⚡ zapq</h1>
        <FileGenerator />
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Project Files</h2>
          <FileTree onFileSelect={loadFile} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Tab bar */}
        <header className="flex items-center bg-white border-b px-4 py-2 space-x-2 shadow-sm overflow-x-auto">
          {openFiles.map(file => (
            <button
              key={file.path}
              onClick={() => {
                setActiveFile(file.path);
                setCode(file.content);
              }}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition whitespace-nowrap ${
                activeFile === file.path
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {file.path.split('/').pop()}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(file.path);
                }}
                className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
              >✕</span>
            </button>
          ))}
        </header>

        {/* Editor and panels */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 max-w-7xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <CodeEditor code={code} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ChatPanel onResponse={setCode} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ProjectRefactor />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <PreviewPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
