import React, { useState } from 'react';
import { Sparkles, Code, Download, Eye, Settings } from 'lucide-react';
import { callClaude } from '../api/callClaude';

interface ComponentGeneratorProps {
  onCodeGenerated: (code: string, filename: string) => void;
}

const ComponentGenerator: React.FC<ComponentGeneratorProps> = ({ onCodeGenerated }) => {
  const [componentName, setComponentName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState('react');
  const [styling, setStyling] = useState('tailwind');
  const [complexity, setComplexity] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleGenerate = async () => {
    if (!componentName || !description) return;

    setIsGenerating(true);
    try {
      const prompt = `Create a ${complexity} complexity ${framework} component called "${componentName}" using ${styling} for styling. 

Description: ${description}

Requirements:
- Use TypeScript
- Include proper prop types and interfaces
- Add hover states and transitions
- Make it responsive
- Include accessibility features
- Use modern React patterns (hooks, functional components)
- Add proper error handling where applicable
- Include JSDoc comments for props

Output only the complete component code without explanations.`;

      const code = await callClaude(prompt);
      setGeneratedCode(code);
      onCodeGenerated(code, `${componentName}.tsx`);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const presetComponents = [
    { name: 'Button', desc: 'A customizable button with variants and sizes' },
    { name: 'Card', desc: 'A flexible card component with header, body, and footer' },
    { name: 'Modal', desc: 'A modal dialog with backdrop and animations' },
    { name: 'Form', desc: 'A form component with validation and error handling' },
    { name: 'Table', desc: 'A data table with sorting and pagination' },
    { name: 'Navbar', desc: 'A responsive navigation bar with mobile menu' },
  ];

  const usePreset = (preset: { name: string; desc: string }) => {
    setComponentName(preset.name);
    setDescription(preset.desc);
  };

  return (
    <div className="bg-surface rounded-lg border border-zinc-800 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Component Generator</h2>
          <p className="text-sm text-zinc-400">Generate React components with AI assistance</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">Quick Presets</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {presetComponents.map((preset) => (
              <button
                key={preset.name}
                onClick={() => usePreset(preset)}
                className="p-3 text-left bg-surface-light hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
              >
                <div className="font-medium text-white text-sm">{preset.name}</div>
                <div className="text-xs text-zinc-400 mt-1">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Component Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Component Name</label>
          <input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="e.g., Button, Card, Modal"
            className="w-full p-3 bg-surface-light border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this component should do and how it should look..."
            rows={3}
            className="w-full p-3 bg-surface-light border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Framework</label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full p-3 bg-surface-light border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Styling</label>
            <select
              value={styling}
              onChange={(e) => setStyling(e.target.value)}
              className="w-full p-3 bg-surface-light border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="tailwind">Tailwind CSS</option>
              <option value="styled-components">Styled Components</option>
              <option value="css-modules">CSS Modules</option>
              <option value="emotion">Emotion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Complexity</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full p-3 bg-surface-light border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="complex">Complex</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!componentName || !description || isGenerating}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          <span>{isGenerating ? 'Generating...' : 'Generate Component'}</span>
        </button>
      </div>
    </div>
  );
};

export default ComponentGenerator;