import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ClassicTicTacToe from './games/ClassicTicTacToe';
import UltimateTicTacToe from './games/UltimateTicTacToe';
import ThreeDTicTacToe from './games/ThreeDTicTacToe';
import MisereTicTacToe from './games/MisereTicTacToe';
import WildTicTacToe from './games/WildTicTacToe';
import Gomoku from './games/Gomoku';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/classic" element={<ClassicTicTacToe />} />
        <Route path="/ultimate" element={<UltimateTicTacToe />} />
        <Route path="/3d" element={<ThreeDTicTacToe />} />
        <Route path="/misere" element={<MisereTicTacToe />} />
        <Route path="/wild" element={<WildTicTacToe />} />
        <Route path="/gomoku" element={<Gomoku />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);