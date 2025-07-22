import React from 'react';
import { Zap, Github, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-surface border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            zapq
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-1 bg-surface-light rounded-lg p-1">
          <button className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-md">
            Editor
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Deploy
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Analytics
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-surface-light rounded-lg transition-all">
          <Github className="w-5 h-5" />
        </button>
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-surface-light rounded-lg transition-all">
          <Settings className="w-5 h-5" />
        </button>
        <button className="p-2 text-zinc-400 hover:text-white hover:bg-surface-light rounded-lg transition-all">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;