import './RulesModal.css';

export default function RulesModal({ onClose }) {
  const rules = `
<span class="section-title">🎯 CEL GRY</span>
Zdobądź sumę kart jak najbliższą 21, nie przekraczając tej liczby! ♣️♥️♦️♠️

<span class="section-title">🧮 LICZENIE PUNKTÓW</span>
• 2–10 → wartość równa numerowi karty.  
• Walet (J), Dama (Q), Król (K) → po 10 punktów.  
• As (A) → może być wart 1 lub 11 punktów (w zależności od tego, co jest korzystniejsze dla gracza).  

<span class="section-title">🏁 PRZEBIEG RUNDY</span>
💰 1. Postaw zakład  
Wybierz kwotę, którą chcesz obstawić — minimum 1 punkt, maksimum 100 punktów.  

♠️ 2. Rozdanie kart  
Ty i krupier otrzymujecie po dwie karty. Jedna karta krupiera pozostaje zakryta 🕵️‍♂️  

🎯 3. Twój ruch (Wybierz jedną z opcji):  
• Hit (Dobierz) – dobierz kolejną kartę, by zbliżyć się do 21.  
• Stand (Zostań) – zatrzymaj się i poczekaj na ruch krupiera.  

🧠 4. Tura krupiera  
Po zakończeniu twojej tury krupier odsłania swoją zakrytą kartę i dobiera kolejne karty, aż osiągnie co najmniej 17 punktów.  

⚖️ 5. Rozstrzygnięcie rundy  
• Blackjack (21 punktów = [As + 10 / Walet / Dama / Król]) → natychmiastowa wygrana!  
• Bust (powyżej 21) → przegrywasz rundę.  
• Masz więcej punktów niż krupier (≤21) → wygrywasz zakład!  
• Mniej punktów niż krupier (≤21) → przegrywasz zakład.  
• Remis → Twój zakład zostaje zwrócony.
`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rules-header">
          <h2>🃏 Zasady 🃏</h2>
        </div>

        <div className="rules-content">
          <pre dangerouslySetInnerHTML={{ __html: rules }} />
        </div>

        <div className="rules-footer">
          <button onClick={onClose} className="close-rules-button">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
