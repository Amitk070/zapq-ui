Here's a React TypeScript + Tailwind component called "Card" in .tsx format:

```tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      {imageUrl && (
        <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      )}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Card;
```

This Card component accepts three props:

1. `title` (required): The title of the card
2. `description` (required): The description or content of the card
3. `imageUrl` (optional): URL of an image to display at the top of the card

The component uses Tailwind CSS classes for styling and is responsive. It includes an image (if provided), a title, a description, and a "Learn More" button.

To use this component, you would import it into another component or page and use it like this:

```tsx
import Card from './Card';

function App() {
  return (
    <div className="p-4">
      <Card
        title="Example Card"
        description="This is an example card component using React, TypeScript, and Tailwind CSS."
        imageUrl="https://example.com/image.jpg"
      />
    </div>
  );
}

export default App;
```

Remember to have Tailwind CSS properly set up in your project for the styles to work correctly.