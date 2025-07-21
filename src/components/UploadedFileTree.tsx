// File: src/components/UploadedFileTree.tsx
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api/config';

interface Props {
  onSelect: (path: string) => void;
}

const UploadedFileTree: React.FC<Props> = ({ onSelect }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE}/files`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch files');
        setFiles(data.files);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="text-sm space-y-1 p-2 bg-gray-50 border rounded">
      <h3 className="font-semibold text-gray-700 mb-1">📁 Uploaded Project Files</h3>
      {error && <div className="text-red-600 text-xs">{error}</div>}
      <ul className="space-y-1">
        {files.map(file => (
          <li
            key={file}
            className="cursor-pointer hover:bg-indigo-50 px-2 py-1 rounded text-gray-800"
            onClick={() => onSelect(file)}
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedFileTree;
