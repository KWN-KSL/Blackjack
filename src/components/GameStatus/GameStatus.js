import './GameStatus.css';

export default function GameStatus({ message, currentBet, gameState }) {
  return (
    <div className="game-status">
      <p className="message">{message}</p>
      {gameState !== 'betting' && gameState !== 'dealing' && (
        <p className="current-bet">Stawka: {currentBet}</p>
      )}
    </div>
  );
}