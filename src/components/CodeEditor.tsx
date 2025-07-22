import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Download, Play, Maximize2, Copy, Check, Wand2 } from 'lucide-react';
import { callClaude } from '../api/callClaude';

type Props = {
  code: string;
  language?: string;
  filename?: string;
};

const CodeEditor: React.FC<Props> = ({ code, language = 'typescript', filename = 'component.tsx' }) => {
  const [editedCode, setEditedCode] = useState(code);
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setEditedCode(code);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    setEditedCode(value || '');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = () => {
    const blob = new Blob([editedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImprove = async () => {
    setLoading(true);
    try {
      const prompt = `Improve and modernize the following React + TypeScript component. Use best practices, clean structure, modern patterns, and Tailwind CSS where appropriate. Make it production-ready:\n\n${editedCode}`;
      const improved = await callClaude(prompt);
      setEditedCode(improved);
    } catch (err) {
      console.error('🧠 Claude improvement error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'flex-1'} flex flex-col bg-surface rounded-lg border border-zinc-800 overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-surface-light">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-zinc-300">{filename}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={isFullscreen ? "calc(100vh - 120px)" : "500px"}
        defaultLanguage={language}
        value={editedCode}
        theme="vs-dark"
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          selectOnLineNumbers: true,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
        }}
      />
      
      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-zinc-800 bg-surface-light">
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <span>{language.toUpperCase()}</span>
          <span>•</span>
          <span>{editedCode.split('\n').length} lines</span>
        </div>
        
        <div className="flex items-center space-x-2">
        <button
          onClick={handleImprove}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          <span>{loading ? 'Improving...' : 'Improve'}</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
