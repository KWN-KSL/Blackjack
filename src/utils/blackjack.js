export const SUITS = ['♥', '♦', '♣', '♠'];
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const STARTING_SCORE = 100;

export function createDeck() {
  return shuffleDeck(SUITS.flatMap(suit => VALUES.map(value => ({ suit, value }))));
}

export function shuffleDeck(deck) {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function calculateScore(hand) {
  let score = 0;
  let aceCount = 0;
  for (const card of hand) {
    if (card.value === 'A') { aceCount++; score += 11; }
    else if (['J', 'Q', 'K'].includes(card.value)) score += 10;
    else score += parseInt(card.value);
  }
  while (score > 21 && aceCount > 0) { score -= 10; aceCount--; }
  return score;
}

export function dealCard(deck) {
  const newDeck = [...deck];
  const card = newDeck.pop();
  return [newDeck, card];
}