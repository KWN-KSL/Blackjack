import { useState } from 'react';
import ModalZasady from './ModalZasady';
import './EkranMenu.css';

export default function EkranMenu({ saldo, graj, resetuj }) {
  const [pokazZasady, ustawPokazZasady] = useState(false);
  return (
    <div className="ekran-menu">
      <h1>Blackjack</h1>
      <h2>Saldo: ${saldo}</h2>
      <button onClick={graj} className="przycisk-menu">Graj</button>
      <button onClick={resetuj} className="przycisk-menu reset">Resetuj Grę</button>
      <button onClick={() => ustawPokazZasady(true)} className="przycisk-menu zasady">Zasady</button>
      {pokazZasady && <ModalZasady zamknij={() => ustawPokazZasady(false)} />}
    </div>
  );
}