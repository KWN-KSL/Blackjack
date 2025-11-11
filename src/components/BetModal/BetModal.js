import { useState } from 'react';
import './BetModal.css';

export default function BetModal({ totalScore, lastGameResult, onStartHand, onBackToMenu, onResetScore }) {
  const minBet = 1;
  const maxBet = Math.max(minBet, Math.floor(totalScore));
  const [bet, setBet] = useState(minBet);

  const canPlay = totalScore >= minBet;

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setBet(val);
  };

  const handleSubmit = () => {
    if (canPlay && bet >= minBet && bet <= maxBet) {
      onStartHand(bet);
    }
  };

  const handleReset = () => {
    onResetScore();
    setBet(minBet);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {lastGameResult && (
          <div className="last-result">
            <h2 style={{
              color: lastGameResult.outcome > 0 ? '#4caf50' : lastGameResult.outcome < 0 ? '#f44336' : '#fdd835'
            }}>
              {lastGameResult.outcome > 0 ? 'Wygrałeś!' : lastGameResult.outcome < 0 ? 'Przegrałeś!' : 'Remis!'}
            </h2>
            <h3>
              Wynik rundy: <span className={lastGameResult.outcome > 0 ? 'win' : lastGameResult.outcome < 0 ? 'loss' : ''}>
                {lastGameResult.outcome > 0 ? '+' : ''}{lastGameResult.outcome}
              </span> punktów
            </h3>
          </div>
        )}

        {!lastGameResult && <h2>Rozpocznij grę!</h2>}

        <p className="modal-score">Twoje punkty: <strong>{totalScore}</strong></p>

        {!canPlay ? (
          <div className="broke-options">
            <p className="error-message">Nie masz dość punktów (min. {minBet}).</p>
            <button onClick={onBackToMenu} className="modal-button back">Powrót do Menu</button>
            <button onClick={handleReset} className="modal-button reset">Resetuj Punkty (100)</button>
          </div>
        ) : (
          <div className="bet-controls">
            <label>Wybierz stawkę ({minBet} - {maxBet}):</label>
            <div className="bet-slider-group">
              <input type="range" value={bet} min={minBet} max={maxBet} step="1" onChange={handleChange} className="bet-slider" style={{'--fill': `${((bet - minBet) / (maxBet - minBet)) * 100}%`}}/>
              <div className="bet-value-display">{bet}</div>
            </div>
            <button onClick={handleSubmit} className="modal-button">
              Zatwierdź i Rozdaj ({bet})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}