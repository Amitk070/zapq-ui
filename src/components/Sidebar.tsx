import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Plus, 
  Search, 
  Code, 
  Sparkles,
  Upload,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  onFileSelect: (path: string) => void;
  files: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onFileSelect, files }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['components', 'pages']));

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const organizeFiles = (files: string[]) => {
    const organized: { [key: string]: string[] } = {};
    
    files.forEach(file => {
      const parts = file.split('/');
      if (parts.length > 1) {
        const folder = parts[0];
        if (!organized[folder]) organized[folder] = [];
        organized[folder].push(file);
      } else {
        if (!organized['root']) organized['root'] = [];
        organized['root'].push(file);
      }
    });
    
    return organized;
  };

  const organizedFiles = organizeFiles(filteredFiles);

  return (
    <aside className="w-80 bg-surface border-r border-zinc-800 flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-light border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-zinc-800">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
            <Sparkles className="w-4 h-4" />
            <span>Generate Component</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium bg-surface-light hover:bg-zinc-700 text-white rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Project</span>
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {Object.entries(organizedFiles).map(([folder, folderFiles]) => (
            <div key={folder} className="animate-fade-in">
              {folder !== 'root' ? (
                <div>
                  <button
                    onClick={() => toggleFolder(folder)}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-surface-light rounded-md transition-colors"
                  >
                    {expandedFolders.has(folder) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Folder className="w-4 h-4 text-blue-400" />
                    <span>{folder}</span>
                  </button>
                  {expandedFolders.has(folder) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {folderFiles.map(file => (
                        <button
                          key={file}
                          onClick={() => onFileSelect(file)}
                          className="w-full flex items-center space-x-2 px-2 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-surface-light rounded-md transition-colors text-left"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{file.split('/').pop()}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                folderFiles.map(file => (
                  <button
                    key={file}
                    onClick={() => onFileSelect(file)}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-surface-light rounded-md transition-colors text-left"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{file}</span>
                  </button>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{files.length} files</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;