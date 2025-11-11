import Card from '../Card/Card';
import FlipCard from '../FlipCard/FlipCard';
import './Hand.css';

export default function Hand({ hand, isPlayer, gameState, isDealerCardFaceUp }) {
  if (gameState === 'betting') {
    return (
      <div className="hand">
        <div className="card placeholder"></div>
        <div className="card placeholder" style={{ animationDelay: '0.2s' }}></div>
      </div>
    );
  }

  return (
    <div className="hand">
      {hand.map((card, i) => {
        if (isPlayer) {
          return <Card key={`p-${i}`} card={card} isAnimated delay={i * 100} />;
        } else {
          if (i === 0) {
            return <FlipCard key="d-0" card={card} isFlipped={isDealerCardFaceUp} isAnimated delay={0} />;
          }
          return <Card key={`d-${i}`} card={card} isAnimated delay={i > 1 ? 0 : 100} />;
        }
      })}
    </div>
  );
}