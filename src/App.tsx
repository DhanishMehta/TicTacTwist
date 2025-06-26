import React from 'react';
import VariantSelector from './components/VariantSelector';

const App: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mt-4">Tic Tac Toe Variants</h1>
      <VariantSelector />
    </div>
  );
};

export default App;