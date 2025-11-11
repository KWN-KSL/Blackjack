import './Header.css';

export default function Header({ totalScore, onBackToMenu }) {
  return (
    <header className="game-header">
      <div className="header-score">Punkty: <span>{totalScore}</span></div>
      <button onClick={onBackToMenu} className="header-button">Powrót do Menu</button>
    </header>
  );
}