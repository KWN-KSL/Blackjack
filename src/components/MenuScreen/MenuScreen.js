import { useState } from 'react';
import RulesModal from '../RulesModal/RulesModal';
import './MenuScreen.css';

export default function MenuScreen({ totalScore, onPlay, onResetScore }) {
  const [showRules, setShowRules] = useState(false);
  return (
    <div className="menu-screen">
      <h1>Blackjack</h1>
      <h2>Twoje punkty: {totalScore}</h2>
      <button onClick={onPlay} className="menu-button">Graj</button>
      <button onClick={onResetScore} className="menu-button reset">Resetuj Punkty</button>
      <button onClick={() => setShowRules(true)} className="menu-button rules-button">Zasady</button>
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}