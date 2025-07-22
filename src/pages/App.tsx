import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AIChat from '../components/AIChat';
import CodeEditor from '../components/CodeEditor';
import ComponentGenerator from '../components/ComponentGenerator';
import ProjectUpload from '../components/ProjectUpload';
import { API_BASE } from '../api/config';

const App = () => {
  type OpenFile = { path: string; content: string };

  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [code, setCode] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'generator' | 'upload'>('chat');

  // Load files on mount
  React.useEffect(() => {
    fetch(`${API_BASE}/files`)
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(() => setFiles([]));
  }, []);
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

  const handleCodeGenerated = (newCode: string, filename?: string) => {
    setCode(newCode);
    if (filename) {
      const newFile = { path: filename, content: newCode };
      setOpenFiles(prev => {
        const existing = prev.find(f => f.path === filename);
        if (existing) {
          return prev.map(f => f.path === filename ? newFile : f);
        }
        return [...prev, newFile];
      });
      setActiveFile(filename);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-white font-sans overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onFileSelect={loadFile} files={files} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center bg-surface border-b border-zinc-800 px-4 py-2 space-x-2 overflow-x-auto">
          {openFiles.map(file => (
            <button
              key={file.path}
              onClick={() => {
                setActiveFile(file.path);
                setCode(file.content);
              }}
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
                activeFile === file.path
                  ? 'bg-primary text-white'
                  : 'hover:bg-surface-light text-zinc-400'
              }`}
            >
              {file.path.split('/').pop()}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(file.path);
                }}
                className="ml-2 text-zinc-400 hover:text-red-400 cursor-pointer"
              >✕</span>
            </button>
          ))}
          </div>

          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left panel - Editor */}
            <div className="flex-1 p-4 overflow-hidden">
              <CodeEditor 
                code={code} 
                filename={activeFile || 'component.tsx'}
                language="typescript"
              />
            </div>
            
            {/* Right panel - AI Tools */}
            <div className="w-96 border-l border-zinc-800 flex flex-col">
              {/* Tab navigation */}
              <div className="flex border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-surface-light'
                  }`}
                >
                  AI Chat
                </button>
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'generator'
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-surface-light'
                  }`}
                >
                  Generator
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'upload'
                      ? 'bg-primary text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-surface-light'
                  }`}
                >
                  Upload
                </button>
              </div>
              
              {/* Tab content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'chat' && (
                  <AIChat onCodeGenerated={handleCodeGenerated} />
                )}
                {activeTab === 'generator' && (
                  <div className="p-4 overflow-y-auto h-full">
                    <ComponentGenerator onCodeGenerated={handleCodeGenerated} />
                  </div>
                )}
                {activeTab === 'upload' && (
                  <div className="p-4 overflow-y-auto h-full">
                    <ProjectUpload />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
