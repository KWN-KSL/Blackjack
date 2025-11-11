import './BetModal.css';
import { useState, useEffect } from 'react';

export default function BetModal({ totalScore, lastGameResult, onStartHand, onBackToMenu, onResetScore }) {
  const minBet = 10;
  const maxBet = Math.max(minBet, Math.floor(totalScore));
  const [bet, setBet] = useState(minBet);
  const canPlay = totalScore >= minBet;

  useEffect(() => {
    let newBet = bet;
    if (newBet > maxBet) newBet = maxBet;
    if (newBet < minBet && canPlay) newBet = minBet;
    if (newBet !== bet) setBet(newBet);
  }, [maxBet, bet, canPlay, minBet]);

  const handleChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = minBet;
    val = Math.max(minBet, Math.min(maxBet, val));
    setBet(val);
  };

  const handleSubmit = () => {
    if (canPlay && bet >= minBet && bet <= maxBet) onStartHand(bet);
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
            <h2 style={{ color: lastGameResult.outcome > 0 ? '#4caf50' : lastGameResult.outcome < 0 ? '#f44336' : '#fdd835' }}>
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
            <p className="error-message">Nie masz dość punktów (min. 10).</p>
            <button onClick={onBackToMenu} className="modal-button back">Powrót do Menu</button>
            <button onClick={handleReset} className="modal-button reset">Resetuj Punkty (100)</button>
          </div>
        ) : (
          <div className="bet-controls">
            <label>Wybierz stawkę (10 - {maxBet}):</label>
            <div className="bet-input-group">
              <input type="number" value={bet} min={minBet} max={maxBet} onChange={handleChange} />
              <input type="range" value={bet} min={minBet} max={maxBet} onChange={handleChange} className="bet-slider" />
            </div>
            <button onClick={handleSubmit} className="modal-button">Zatwierdź i Rozdaj ({bet})</button>
          </div>
        )}
      </div>
    </div>
  );
}