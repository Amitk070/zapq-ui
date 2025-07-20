import React, { useState } from 'react';
import { callClaude } from '../api/callClaude';

const FileGenerator: React.FC = () => {
  const [filename, setFilename] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!filename) return;
    setLoading(true);
    setStatus('');
    try {
      const prompt = `Create a React TypeScript + Tailwind component called "${filename.replace(/\.tsx$/, '')}" and output only the .tsx code.`;
      const code = await callClaude(prompt);

      const res = await fetch('http://localhost:3001/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `components/${filename.endsWith('.tsx') ? filename : filename + '.tsx'}`,
          content: code,
        })
      });

      if (!res.ok) throw new Error('Save failed');
      setStatus('✅ File generated and saved');
    } catch (err) {
      console.error('💥 Claude File Save Error:', err);
      if (err instanceof Response) {
        err.text().then(text => console.error('❗ Server said:', text));
      }
      setStatus('❌ Failed to generate file');
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b flex items-center gap-4">
      <input
        className="border p-2 w-64 text-sm"
        placeholder="Filename (e.g. Card.tsx)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !filename}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : '⚡ Generate with Claude'}
      </button>
      {status && <span className="text-sm ml-2">{status}</span>}
    </div>
  );
};

export default FileGenerator;
