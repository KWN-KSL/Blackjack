import './Controls.css';
import { useState } from 'react';

export default function Controls({ gameState, onHit, onStand, onNewRound }) {
  const [isHitDisabled, setIsHitDisabled] = useState(false);

  const handleHit = () => {
    if (isHitDisabled || gameState !== 'playerTurn') return;
    setIsHitDisabled(true);
    onHit();
    setTimeout(() => setIsHitDisabled(false), 600);
  };

  return (
    <div className="controls">
      {gameState === 'playerTurn' && (
        <>
          <button onClick={handleHit} disabled={isHitDisabled}>Hit (Dobierz)</button>
          <button onClick={onStand}>Stand (Pasuj)</button>
        </>
      )}
      {gameState === 'end' && (
        <button onClick={onNewRound} className="new-round-button">Nowa Runda</button>
      )}
    </div>
  );
}