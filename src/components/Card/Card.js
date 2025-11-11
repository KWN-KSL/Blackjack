import './Card.css';

export default function Card({ card, isHidden = false, isAnimated = false, delay = 0 }) {
  const animationClass = isAnimated ? 'card-appear' : '';
  const animationStyle = isAnimated ? { animationDelay: `${delay}ms` } : {};

  if (isHidden) {
    return <div className={`card hidden ${animationClass}`} style={animationStyle} />;
  }
  const color = card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  return (
    <div className={`card ${color} ${animationClass}`} style={animationStyle}>
      <span className="value">{card.value}</span>
      <span className="suit">{card.suit}</span>
    </div>
  );
}