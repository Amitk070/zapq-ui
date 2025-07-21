import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api/config';

type Props = {
  onFileSelect: (path: string) => void;
};

const FileTree: React.FC<Props> = ({ onFileSelect }) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/files`)
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(() => setFiles([]));
  }, []);

  return (
    <div className="p-4 border-r h-full w-1/4 bg-gray-100 overflow-auto">
      <h2 className="font-bold text-lg mb-2">Files</h2>
      <ul className="text-sm">
        {files.map((file, idx) => (
          <li
            key={idx}
            onClick={() => onFileSelect(file)}
            className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded"
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileTree;
