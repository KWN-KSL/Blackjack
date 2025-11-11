import { useState } from 'react';
import MenuScreen from './components/MenuScreen/MenuScreen';
import GameScreen from './components/GameScreen/GameScreen';
import { STARTING_SCORE } from './utils/blackjack';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [totalScore, setTotalScore] = useState(STARTING_SCORE);

  const handleResetScore = () => setTotalScore(STARTING_SCORE);

  if (screen === 'menu') {
    return <MenuScreen totalScore={totalScore} onPlay={() => setScreen('game')} onResetScore={handleResetScore} />;
  }

  return (
    <GameScreen
      totalScore={totalScore}
      setTotalScore={setTotalScore}
      onBackToMenu={() => setScreen('menu')}
      onResetScore={handleResetScore}
    />
  );
}