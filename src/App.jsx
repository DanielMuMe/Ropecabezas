import React, { useState, useCallback } from 'react';
import './App.css';

const PUZZLE_SIZE = 3;
const TOTAL_PIECES = PUZZLE_SIZE * PUZZLE_SIZE;

// Genera el orden inicial desordenado
const generateShuffledPieces = () => {
  const pieces = Array.from({ length: TOTAL_PIECES - 1 }, (_, i) => i);
  pieces.push(null); // El último espacio es vacío
  return pieces.sort(() => Math.random() - 0.5);
};

// Verifica si el puzzle está resuelto
const isSolved = (pieces) => {
  for (let i = 0; i < TOTAL_PIECES - 1; i++) {
    if (pieces[i] !== i) return false;
  }
  return pieces[TOTAL_PIECES - 1] === null;
};

const App = () => {
  const [pieces, setPieces] = useState(generateShuffledPieces());
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const getEmptyIndex = useCallback(() => pieces.findIndex(p => p === null), [pieces]);

  const canMove = (index) => {
    const emptyIndex = getEmptyIndex();
    const row = Math.floor(index / PUZZLE_SIZE);
    const col = index % PUZZLE_SIZE;
    const emptyRow = Math.floor(emptyIndex / PUZZLE_SIZE);
    const emptyCol = emptyIndex % PUZZLE_SIZE;

    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const movePiece = (index) => {
    if (!canMove(index) || solved) return;

    const newPieces = [...pieces];
    const emptyIndex = getEmptyIndex();
    [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
    setPieces(newPieces);
    setMoves(moves + 1);

    if (isSolved(newPieces)) {
      setSolved(true);
      alert('¡Felicidades! Has resuelto el rompecabezas 🎉');
    }
  };

  const resetPuzzle = () => {
    setPieces(generateShuffledPieces());
    setMoves(0);
    setSolved(false);
  };

  return (
    <div className="app">
      <h1>Rompecabezas 3x3</h1>
      <p>Movimientos: {moves}</p>
      {solved && <p className="solved">¡Resuelto!</p>}
      <div className="puzzle-grid">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`puzzle-piece ${piece === null ? 'empty' : ''}`}
            onClick={() => movePiece(index)}
          >
            {piece !== null ? piece + 1 : ''}
          </div>
        ))}
      </div>
      <button onClick={resetPuzzle} className="reset-btn">
        Reiniciar
      </button>
    </div>
  );
};

export default App;