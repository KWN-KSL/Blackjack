import './ModalZasady.css';

export default function ModalZasady({ zamknij }) {
  const zasadyHTML = `
<span class="tytul-sekcji">CEL GRY</span>
Zdobądź sumę kart jak najbliższą 21, nie przekraczając tej liczby! Pokonaj krupiera, mając wyższy wynik.

<span class="tytul-sekcji">WARTOŚCI KART</span>
• 2-10 → zgodnie z liczbą na karcie.
• Walet (J), Dama (Q), Król (K) → 10 punktów.
• As (A) → 1 lub 11 punktów (to, co lepsze dla gracza).

<span class="tytul-sekcji">PRZEBIEG GRY</span>
1. Obstawianie
Wybierz żetony, zagraj <b>ALL IN</b> (wszystko) lub wyczyść zakład.
Możesz też włączyć Automatyczną Grę, gdzie bot będzie grał za Ciebie według optymalnej strategii matematycznej.

2. Rozdanie
Ty i krupier dostajecie po dwie karty. Jedna karta krupiera jest ukryta.

3. Możliwe decyzje
• Hit (Dobierz) - bierzesz kolejną kartę.
• Stand (Pasuj) - kończysz turę z obecnym wynikiem.
• Double (Podwój) - podwajasz stawkę, dobierasz <u>tylko jedną</u> kartę i kończysz turę (dostępne tylko przy 2 pierwszych kartach).
• Ubezpieczenie - gdy krupier ma Asa, możesz postawić połowę stawki, że krupier ma Blackjacka (21). Jeśli trafisz, wygrywasz 2:1 z ubezpieczenia.

4. Tura Krupiera
Krupier musi dobierać karty, dopóki ma mniej niż 17 punktów.

5. Wynik
• Blackjack (As + 10/J/Q/K w dwóch pierwszych kartach) → Zwrot stawki + wypłata 150%.
• Wygrana (lepszy wynik niż krupier) → Zwrot stawki + wypłata 100%.
• Remis (Push) → Zwrot stawki.
• Przegrana (> 21 lub mniej pkt niż krupier) → Utrata stawki.
`;

  return (
    <div className="tlo-modalu" onClick={zamknij}>
      <div className="modal-zasady" onClick={(e) => e.stopPropagation()}>
        <div className="naglowek-zasad">
          <h2>Zasady Gry</h2>
        </div>
        <div className="tresc-zasad">
          <pre dangerouslySetInnerHTML={{ __html: zasadyHTML }} />
        </div>
        <div className="stopka-zasad">
          <button onClick={zamknij} className="przycisk-zamknij">Zamknij</button>
        </div>
      </div>
    </div>
  );
}