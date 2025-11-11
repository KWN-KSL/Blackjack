import Card from '../Card/Card';
import './FlipCard.css';

export default function FlipCard({ card, isFlipped, isAnimated, delay = 0 }) {
  const animationClass = isAnimated ? 'card-appear' : '';
  const animationStyle = isAnimated ? { animationDelay: `${delay}ms` } : {};

  return (
    <div className={`flip-card ${isFlipped ? 'is-flipped' : ''} ${animationClass}`} style={animationStyle}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <Card isHidden />
        </div>
        <div className="flip-card-back">
          <Card card={card} isAnimated={isAnimated} delay={delay} />
        </div>
      </div>
    </div>
  );
}