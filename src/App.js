import { useState, useEffect } from 'react';
import EkranMenu from './components/EkranMenu';
import EkranGry from './components/EkranGry';
import { PUNKTY_STARTOWE } from './utils/logikaGry';
import './App.css';

export default function App() {
  const [ekran, ustawEkran] = useState('menu');
  const [saldo, ustawSaldo] = useState(() => {
    const zapisaneSaldo = localStorage.getItem('blackjack_saldo');
    return zapisaneSaldo !== null ? parseInt(zapisaneSaldo, 10) : PUNKTY_STARTOWE;
  });

  useEffect(() => {
    localStorage.setItem('blackjack_saldo', saldo);
  }, [saldo]);

  const resetujGre = () => ustawSaldo(PUNKTY_STARTOWE);

  if (ekran === 'menu') {
    return (
      <EkranMenu 
        saldo={saldo} 
        graj={() => ustawEkran('gra')} 
        resetuj={resetujGre} 
      />
    );
  }

  return (
    <EkranGry
      saldo={saldo}
      ustawSaldo={ustawSaldo}
      powrotDoMenu={() => ustawEkran('menu')}
      resetujGre={resetujGre}
    />
  );
}