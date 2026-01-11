import { useState } from 'react';
import './ModalZakladu.css';

export default function ModalZakladu({ saldo, startRundy, startAutoGry, powrotDoMenu, resetujGre }) {
  const [zaklad, ustawZaklad] = useState(0);
  const dostepneZetony = [5, 10, 25, 100, 500];

  const dodajZeton = (wartosc) => {
    if (zaklad + wartosc <= saldo) {
      ustawZaklad(zaklad + wartosc);
    }
  };

  const allIn = () => ustawZaklad(saldo);
  const wyczyscZaklad = () => ustawZaklad(0);
  const zatwierdz = () => startRundy(zaklad);
  const zatwierdzAuto = () => startAutoGry(zaklad);

  const reset = () => {
    resetujGre();
    ustawZaklad(0);
  };

  return (
    <div className="tlo-modalu">
      <div className="tresc-modalu">
        <h2>Postaw zakład</h2>
        <div className="info-finansowe">
          <div className="info-box">
            <span>Twoje Saldo</span>
            <strong>${saldo - zaklad}</strong>
          </div>
          <div className="info-box aktywny">
            <span>Zakład</span>
            <strong>${zaklad}</strong>
          </div>
        </div>
        {saldo === 0 ? (
          <div className="opcje-bankructwa">
            <p className="blad">Brak środków na koncie</p>
            <button onClick={reset} className="przycisk-modalu reset">Resetuj Saldo (1000)</button>
            <button onClick={powrotDoMenu} className="przycisk-tekstowy" style={{marginTop: '0'}}>Wróć do menu</button>
          </div>
        ) : (
          <>
            <div className="strefa-zetonow">
              {dostepneZetony.map((wartosc) => (
                <button key={wartosc} className={`zeton zeton-${wartosc}`} onClick={() => dodajZeton(wartosc)} disabled={zaklad + wartosc > saldo}>{wartosc}</button>
              ))}
            </div>

            <div className="akcje-zakladu">
              <button onClick={allIn} className="przycisk-modalu all-in" disabled={saldo - zaklad === 0}>All In</button>
              <button onClick={zatwierdz} className="przycisk-modalu graj" disabled={zaklad === 0}>Rozdaj Karty</button>
              <button onClick={wyczyscZaklad} className="przycisk-modalu wyczysc" disabled={zaklad === 0}>Wyczyść Zakład</button>
              <button onClick={zatwierdzAuto} className="przycisk-modalu graj-auto" disabled={zaklad === 0}>Automatyczna Gra</button>
            </div>
            
            <button onClick={powrotDoMenu} className="przycisk-tekstowy">Wróć do menu</button>
          </>
        )}
      </div>
    </div>
  );
}