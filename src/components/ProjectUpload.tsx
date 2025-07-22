import React, { useState, useRef } from 'react';
import { Upload, FileText, Folder, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE } from '../api/config';

const ProjectUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find(file => file.name.endsWith('.zip'));
    
    if (zipFile) {
      handleFileUpload(zipFile);
    } else {
      setUploadStatus('error');
      setUploadMessage('Please upload a .zip file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadStatus('uploading');
    setUploadMessage('Uploading project...');
    setAnalysisResult('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name.replace(/\.zip$/, ''));

      const uploadRes = await fetch(`${API_BASE}/upload-project`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error('Upload failed');

      setUploadMessage('Analyzing project with AI...');

      const refactorRes = await fetch(`${API_BASE}/claude-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPath: uploadData.path }),
      });

      const refactorData = await refactorRes.json();
      if (!refactorData.success) throw new Error('AI analysis failed');

      setUploadStatus('success');
      setUploadMessage('Project analyzed successfully!');
      setAnalysisResult(refactorData.output);
    } catch (error: any) {
      setUploadStatus('error');
      setUploadMessage(error.message || 'Upload failed');
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadMessage('');
    setAnalysisResult('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-zinc-800 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Project Upload & Analysis</h2>
          <p className="text-sm text-zinc-400">Upload your project for AI-powered analysis and suggestions</p>
        </div>
      </div>

      {uploadStatus === 'idle' && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-zinc-700 hover:border-zinc-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center">
              <Folder className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-white mb-2">
                Drop your project here
              </p>
              <p className="text-sm text-zinc-400 mb-4">
                or click to browse for a .zip file
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {uploadStatus === 'uploading' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg font-medium text-white mb-2">{uploadMessage}</p>
          <div className="w-64 h-2 bg-surface-light rounded-full mx-auto">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-medium text-green-400">{uploadMessage}</p>
              <p className="text-sm text-zinc-400">Your project has been analyzed by AI</p>
            </div>
          </div>
          
          {analysisResult && (
            <div className="bg-surface-light border border-zinc-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                AI Analysis Results
              </h3>
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap overflow-x-auto">
                {analysisResult}
              </pre>
            </div>
          )}
          
          <button
            onClick={resetUpload}
            className="w-full py-2 bg-surface-light hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
          >
            Upload Another Project
          </button>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Upload Failed</p>
              <p className="text-sm text-zinc-400">{uploadMessage}</p>
            </div>
          </div>
          
          <button
            onClick={resetUpload}
            className="w-full py-2 bg-surface-light hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectUpload;