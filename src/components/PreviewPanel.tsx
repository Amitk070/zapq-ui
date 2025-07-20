import React from 'react';

const PreviewPanel = () => {
  return (
    <div className="border-t p-4">
      <h2 className="font-bold text-lg mb-2">Live Preview</h2>
      <iframe title="Preview" src="http://localhost:5173" className="w-full h-96 border" />
    </div>
  );
};

export default PreviewPanel;
