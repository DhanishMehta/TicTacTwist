import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad, Star, Layers, Ban, Shuffle, Grid } from 'lucide-react';

const variants = [
  { name: 'Classic Tic-Tac-Toe', path: '/classic', icon: <Gamepad className="inline mr-2" /> },
  { name: 'Ultimate Tic-Tac-Toe', path: '/ultimate', icon: <Star className="inline mr-2" /> },
  { name: '3D Tic-Tac-Toe', path: '/3d', icon: <Layers className="inline mr-2" /> },
  { name: 'Misère Tic-Tac-Toe', path: '/misere', icon: <Ban className="inline mr-2" /> },
  { name: 'Wild Tic-Tac-Toe', path: '/wild', icon: <Shuffle className="inline mr-2" /> },
  { name: 'Gomoku', path: '/gomoku', icon: <Grid className="inline mr-2" /> }
];

const VariantSelector: React.FC = () => {
  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-semibold mb-4">Select a Game Variant</h2>
      <ul className="space-y-4 flex flex-col items-center justify-center">
        {variants.map((v) => (
          <li key={v.path}>
            <Link to={v.path}>
              <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {v.icon} {v.name}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariantSelector;