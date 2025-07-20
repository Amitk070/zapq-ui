import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { callClaude } from '../api/callClaude';

type Props = {
  code: string;
};

const CodeEditor: React.FC<Props> = ({ code }) => {
  const [editedCode, setEditedCode] = useState(code);
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    setEditedCode(value || '');
  };

  const handleSave = () => {
    const blob = new Blob([editedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ClaudeOutput.tsx'; // customize filename
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImprove = async () => {
    setLoading(true);
    try {
      const prompt = `Improve and modernize the following React + TypeScript component. Use best practices, clean structure, and Tailwind CSS where appropriate:\n\n${editedCode}`;
      const improved = await callClaude(prompt);
      setEditedCode(improved);
    } catch (err) {
      console.error('🧠 Claude improvement error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 border-t h-full flex flex-col">
      <Editor
        height="60vh"
        defaultLanguage="typescript"
        value={editedCode}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />
      <div className="flex justify-between px-4 py-2">
        <button
          onClick={handleImprove}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Improving...' : '🧠 Improve this Code'}
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💾 Save to File
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
