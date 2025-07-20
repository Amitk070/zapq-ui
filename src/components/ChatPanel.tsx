import React, { useState } from 'react';
import { callClaude } from '../api/callClaude';

type Props = {
  onResponse: (code: string) => void;
};

const ChatPanel: React.FC<Props> = ({ onResponse }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    try {
      const output = await callClaude(prompt);
      setResponse(output);
      onResponse(output); // 🧠 Send to App.tsx so it reaches Monaco
    } catch (err) {
      setError("Failed to get response from Claude.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b">
      <h2 className="font-bold text-lg mb-2">Chat with Zapq</h2>
      <textarea
        className="w-full h-28 border p-2 mb-2 text-sm"
        placeholder="Describe what you want..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSend}
        disabled={loading || !prompt}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Send'}
      </button>

      {/* Local output display (optional) */}
      {response && (
        <div className="mt-4 bg-gray-100 p-4 rounded border text-sm whitespace-pre-wrap font-mono">
          <h3 className="font-semibold mb-1">💬 Claude Response:</h3>
          {response}
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ChatPanel;
