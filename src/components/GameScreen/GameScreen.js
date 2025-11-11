import { useState, useEffect, useRef, useCallback } from 'react';
import { createDeck, dealCard, calculateScore } from '../../utils/blackjack';
import Header from '../Header/Header';
import Hand from '../Hand/Hand';
import GameStatus from '../GameStatus/GameStatus';
import Controls from '../Controls/Controls';
import BetModal from '../BetModal/BetModal';

const DEAL_ANIMATION_DELAY = 600;

export default function GameScreen({
  totalScore,
  setTotalScore,
  onBackToMenu,
  onResetScore,
}) {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('betting');
  const [message, setMessage] = useState('Postaw zakład, aby rozpocząć rundę.');
  const [currentBet, setCurrentBet] = useState(0);
  const [lastGameResult, setLastGameResult] = useState(null);
  const [isDealerCardFaceUp, setIsDealerCardFaceUp] = useState(false);

  const deckRef = useRef([]);
  const hasEndedRef = useRef(false);

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  /* ---------- ENDGAME Z BET AMOUNT ---------- */
  const endGame = useCallback((finalDealerScore, finalPlayerScore, betAmount) => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    setIsDealerCardFaceUp(true);
    setGameState('end');

    let result = '';
    let outcome = 0;

    if (finalPlayerScore > 21) {
      result = 'Przekroczyłeś 21! Przegrałeś.';
      outcome = -betAmount;
    } else if (finalDealerScore > 21) {
      result = 'Dealer przekroczył 21! Wygrałeś!';
      outcome = betAmount;
    } else if (finalPlayerScore > finalDealerScore) {
      result = 'Wygrałeś!';
      outcome = betAmount;
    } else if (finalDealerScore > finalPlayerScore) {
      result = 'Przegrałeś! Dealer ma więcej punktów.';
      outcome = -betAmount;
    } else {
      result = 'Remis!';
      outcome = 0;
    }

    setMessage(result);
    setTotalScore((s) => s + outcome);
    setLastGameResult({ outcome });
  }, [setTotalScore]);

  /* ---------- ✅ NOWY useEffect: AUTO-END GRACZA ---------- */
  useEffect(() => {
    if (gameState !== 'playerTurn' || hasEndedRef.current) return;

    // Gracz >21? BUST → przegrana
    if (playerScore > 21) {
      setTimeout(() => endGame(dealerScore, playerScore, currentBet), 300);
      return;
    }

    // Gracz =21? AUTO-WYGRANA (niezależnie od dealera)
    if (playerScore === 21) {
      setTimeout(() => endGame(0, playerScore, currentBet), 500); // dealerScore=0 bo gracz wygrał
      return;
    }
  }, [playerHand, gameState, playerScore, dealerScore, endGame, currentBet]);

  /* ---------- TURNA DEALERA ---------- */
  useEffect(() => {
    if (gameState !== 'dealerTurn') return;

    if (!isDealerCardFaceUp) {
      setIsDealerCardFaceUp(true);
      return;
    }

    const dScore = calculateScore(dealerHand);
    const pScore = playerScore;

    if (pScore > 21) {
      endGame(dScore, pScore, currentBet);
      return;
    }

    if (dScore >= 17) {
      endGame(dScore, pScore, currentBet);
      return;
    }

    const timer = setTimeout(() => {
      const [newDeck, card] = dealCard(deckRef.current);
      deckRef.current = newDeck;
      setDealerHand((h) => [...h, card]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, dealerHand, playerScore, endGame, isDealerCardFaceUp, currentBet]);

  const startHand = useCallback((bet) => {
    hasEndedRef.current = false;

    const actualBet = Math.min(bet, totalScore);
    setCurrentBet(actualBet);
    setLastGameResult(null);

    setGameState('dealing');
    setMessage('Rozdawanie kart...');
    setPlayerHand([]);
    setDealerHand([]);
    setIsDealerCardFaceUp(false);

    const newDeck = createDeck();
    deckRef.current = newDeck;

    const [d1, p1] = dealCard(deckRef.current);
    deckRef.current = d1;
    const [d2, d1Card] = dealCard(deckRef.current);
    deckRef.current = d2;
    const [d3, p2] = dealCard(deckRef.current);
    deckRef.current = d3;
    const [d4, d2Card] = dealCard(deckRef.current);
    deckRef.current = d4;

    setPlayerHand([p1, p2]);
    setDealerHand([d1Card, d2Card]);

    setTimeout(() => {
      const pScore = calculateScore([p1, p2]);
      const dScore = calculateScore([d1Card, d2Card]);

      // SPRAWDŹ TYLKO PIERWSZE 2 KARTY NA BLACKJACK
      if (pScore === 21 || dScore === 21) {
        endGame(dScore, pScore, actualBet);
      } else {
        setGameState('playerTurn');
        setMessage('Twoja kolej. Hit czy Stand?');
      }
    }, DEAL_ANIMATION_DELAY);
  }, [totalScore, endGame]);

  const handleHit = useCallback(() => {
    if (gameState !== 'playerTurn' || hasEndedRef.current) return;

    const [newDeck, card] = dealCard(deckRef.current);
    deckRef.current = newDeck;
    setPlayerHand((h) => [...h, card]); // ✅ useEffect obsłuży wynik
  }, [gameState]);

  const handleStand = () => {
    if (gameState !== 'playerTurn') return;
    setGameState('dealerTurn');
    setMessage('Tura Dealera...');
  };

  const handleNewRound = () => {
    setGameState('betting');
  };

  const getDealerVisibleScore = () => {
    if (
      (gameState === 'playerTurn' || gameState === 'dealing') &&
      dealerHand.length > 1 &&
      !isDealerCardFaceUp
    ) {
      return calculateScore([dealerHand[1]]);
    }
    return dealerScore;
  };

  return (
    <div className="game-container">
      {gameState === 'betting' && (
        <BetModal
          totalScore={totalScore}
          lastGameResult={lastGameResult}
          onStartHand={startHand}
          onBackToMenu={onBackToMenu}
          onResetScore={onResetScore}
        />
      )}
      <Header totalScore={totalScore} onBackToMenu={onBackToMenu} />
      <div className="blackjack-app">
        <div className="game-board">
          <div className="hand-container">
            <h2>Dealer (Wynik: {getDealerVisibleScore()})</h2>
            <Hand
              hand={dealerHand}
              isPlayer={false}
              gameState={gameState}
              isDealerCardFaceUp={isDealerCardFaceUp}
            />
          </div>

          <GameStatus
            message={message}
            currentBet={currentBet}
            gameState={gameState}
          />

          <div className="hand-container">
            <h2>Gracz (Wynik: {playerScore})</h2>
            <Hand hand={playerHand} isPlayer={true} gameState={gameState} />
          </div>
        </div>

        <Controls
          gameState={gameState}
          onHit={handleHit}
          onStand={handleStand}
          onNewRound={handleNewRound}
        />
      </div>
    </div>
  );
}