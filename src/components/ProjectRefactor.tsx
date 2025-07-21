// File: src/components/ProjectRefactor.tsx
import React, { useState } from 'react';
import { API_BASE } from '../api/config';

const ProjectRefactor: React.FC = () => {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setZipFile(e.target.files[0]);
    }
  };

  const handleUploadAndRefactor = async () => {
    if (!zipFile) return;
    setUploading(true);
    setResult('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', zipFile);
      formData.append('name', zipFile.name.replace(/\.zip$/, ''));

      const uploadRes = await fetch(`${API_BASE}/upload-project`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error('Upload failed');

      const refactorRes = await fetch(`${API_BASE}/claude-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPath: uploadData.path }),
      });

      const refactorData = await refactorRes.json();
      if (!refactorData.success) throw new Error('Claude failed to analyze project');

      setResult(refactorData.output);
    } catch (err: any) {
      console.error('Refactor error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow space-y-4">
      <h2 className="text-lg font-bold text-gray-800">📦 Claude Project Refactor</h2>

      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        className="block border p-2 w-full text-sm"
      />

      <button
        onClick={handleUploadAndRefactor}
        disabled={!zipFile || uploading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {uploading ? 'Refactoring...' : 'Upload & Analyze with Claude'}
      </button>

      {error && <div className="text-red-600 text-sm">❌ {error}</div>}
      {result && (
        <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-3 rounded max-h-96 overflow-y-auto">
          {result}
        </pre>
      )}
    </div>
  );
};

export default ProjectRefactor;
