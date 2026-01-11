import { useState, useEffect, useRef, useCallback } from 'react';
import { stworzTalie, rozdajKarte, obliczPunkty } from '../utils/logikaGry';
import { pobierzDecyzjeBota } from '../utils/StrategiaBota';
import Reka from './Reka';
import ModalZakladu from './ModalZakladu';
import './EkranGry.css';

const OPOZNIENIE_ROZDANIA = 1500;
const PREDKOSC_BOTA = 2500; 

export default function EkranGry({ saldo, ustawSaldo, powrotDoMenu, resetujGre }) {
  const [rekaGracza, ustawRekeGracza] = useState([]);
  const [rekaKrupiera, ustawRekeKrupiera] = useState([]);
  const [stanGry, ustawStanGry] = useState('obstawianie'); 
  const [komunikat, ustawKomunikat] = useState('Postaw zakład, aby rozpocząć.');
  const [aktualnyZaklad, ustawAktualnyZaklad] = useState(0);
  const [czyKartaKrupieraOdkryta, ustawCzyKartaKrupieraOdkryta] = useState(false);
  const [blokadaDobierania, ustawBlokadaDobierania] = useState(false);
  const [zakladUbezpieczenia, ustawZakladUbezpieczenia] = useState(0);

  const [czyAutoGra, ustawCzyAutoGra] = useState(false);
  const [stawkaAuto, ustawStawkaAuto] = useState(0);

  const taliaRef = useRef([]);
  const czyKoniecGryRef = useRef(false);

  const punktyGracza = obliczPunkty(rekaGracza);
  const punktyKrupiera = obliczPunkty(rekaKrupiera);

  const zakonczGre = useCallback((pKrupiera, pGracza, stawka, czyBlackjack = false, wygranaZUbezpieczenia = 0) => {
    if (czyKoniecGryRef.current) return;
    czyKoniecGryRef.current = true;
    ustawCzyKartaKrupieraOdkryta(true);
    ustawStanGry('koniec');

    let wyplata = 0;
    let tekstWyniku = '';
    
    if (pGracza > 21) {
      tekstWyniku = 'Przekroczyłeś 21! Przegrałeś.';
      wyplata = 0;
    } else if (pKrupiera > 21) {
      tekstWyniku = 'Krupier przekroczył 21! Wygrałeś!';
      wyplata = stawka * 2;
    } else if (czyBlackjack && pGracza === 21 && pKrupiera !== 21) {
      tekstWyniku = 'Wygrałeś! BLACKJACK!';
      wyplata = Math.ceil(stawka * 2.5);
    } else if (czyBlackjack && pKrupiera === 21 && pGracza !== 21) {
      tekstWyniku = 'Krupier ma BLACKJACKA! Przegrałeś.';
      wyplata = 0;
    } else if (pGracza > pKrupiera) {
      tekstWyniku = 'Wygrałeś!';
      wyplata = stawka * 2;
    } else if (pKrupiera > pGracza) {
      tekstWyniku = 'Przegrałeś! Krupier ma więcej.';
      wyplata = 0;
    } else {
      tekstWyniku = 'Remis!';
      wyplata = stawka;
    }

    const lacznaWyplata = wyplata + wygranaZUbezpieczenia;
    if (wygranaZUbezpieczenia > 0) {
      tekstWyniku += ` (Ubezpieczenie wypłaca: ${wygranaZUbezpieczenia})`;
    }

    ustawSaldo((s) => s + lacznaWyplata);
    ustawKomunikat(`${tekstWyniku} Wypłata: $${lacznaWyplata}`);
  }, [ustawSaldo]);

  const sprawdzBlackjackaPoUbezpieczeniu = useCallback((czyKupiono) => {
    const pKrupiera = obliczPunkty(rekaKrupiera);
    const pGracza = obliczPunkty(rekaGracza);
    
    if (pKrupiera === 21) {
      let wygranaUbezp = 0;
      if (czyKupiono) wygranaUbezp = zakladUbezpieczenia * 2;
      zakonczGre(pKrupiera, pGracza, aktualnyZaklad, true, wygranaUbezp);
    } else {
      ustawKomunikat(czyKupiono ? 'Krupier nie ma Blackjacka. Ubezpieczenie przepada.' : 'Krupier nie ma Blackjacka. Gramy dalej.');
      ustawStanGry('wynikUbezpieczenia');
    }
  }, [rekaKrupiera, rekaGracza, zakladUbezpieczenia, aktualnyZaklad, zakonczGre]);

  const startRundy = useCallback((zaklad) => {
    czyKoniecGryRef.current = false;
    const realnyZaklad = Math.min(zaklad, saldo);
    ustawAktualnyZaklad(realnyZaklad);
    ustawSaldo(s => s - realnyZaklad); 
    ustawStanGry('rozdawanie');
    ustawKomunikat('Rozdawanie kart');
    ustawRekeGracza([]);
    ustawRekeKrupiera([]);
    ustawCzyKartaKrupieraOdkryta(false);
    ustawZakladUbezpieczenia(0);

    taliaRef.current = stworzTalie();
    let tempTalia = taliaRef.current;
    let k1, k2, g1, g2;
    
    [tempTalia, g1] = rozdajKarte(tempTalia);
    [tempTalia, k1] = rozdajKarte(tempTalia);
    [tempTalia, g2] = rozdajKarte(tempTalia);
    [tempTalia, k2] = rozdajKarte(tempTalia);
    
    taliaRef.current = tempTalia;
    ustawRekeGracza([g1, g2]);
    ustawRekeKrupiera([k1, k2]);

    setTimeout(() => {
      const pGracza = obliczPunkty([g1, g2]);
      const pKrupiera = obliczPunkty([k1, k2]);
      
      if (k2.wartosc === 'A') {
        ustawStanGry('ubezpieczenie');
        ustawKomunikat('Krupier ma Asa! Ubezpieczenie?');
      } else if (pGracza === 21 || pKrupiera === 21) {
        zakonczGre(pKrupiera, pGracza, realnyZaklad, true);
      } else {
        ustawStanGry('turaGracza');
        if (czyAutoGra) {
           ustawKomunikat('Bot analizuje rozdanie');
        } else {
           ustawKomunikat('Twój ruch');
        }
      }
    }, OPOZNIENIE_ROZDANIA);
  }, [saldo, zakonczGre, ustawSaldo, czyAutoGra]);

  const dobierzKarte = useCallback(() => {
    if (blokadaDobierania || stanGry !== 'turaGracza') return;
    ustawBlokadaDobierania(true);
    const [nowaTalia, karta] = rozdajKarte(taliaRef.current);
    taliaRef.current = nowaTalia;
    ustawRekeGracza((h) => [...h, karta]);
    setTimeout(() => ustawBlokadaDobierania(false), 600);
  }, [blokadaDobierania, stanGry]);

  const pasuj = useCallback(() => {
    if (stanGry !== 'turaGracza') return;
    ustawStanGry('turaKrupiera');
    ustawKomunikat('Tura Krupiera');
  }, [stanGry]);

  const podwoj = useCallback(() => {
    if (stanGry !== 'turaGracza' || rekaGracza.length !== 2) return;
    if (saldo < aktualnyZaklad) return;

    ustawSaldo(s => s - aktualnyZaklad);
    ustawStanGry('podwajanie');
    const nowaStawka = aktualnyZaklad * 2;
    ustawAktualnyZaklad(nowaStawka);

    const [nowaTalia, karta] = rozdajKarte(taliaRef.current);
    taliaRef.current = nowaTalia;
    const nowaReka = [...rekaGracza, karta];
    ustawRekeGracza(nowaReka);

    setTimeout(() => {
      const punkty = obliczPunkty(nowaReka);
      if (punkty > 21) {
        ustawKomunikat('Tura Krupiera');
        ustawStanGry('turaKrupiera');
      } else {
        ustawStanGry('turaKrupiera');
        ustawKomunikat('Tura Krupiera (Double)');
      }
      ustawBlokadaDobierania(false);
    }, 800);
  }, [stanGry, rekaGracza, saldo, aktualnyZaklad, ustawSaldo]);

  const poPotwierdzeniuUbezpieczenia = useCallback(() => {
    const pGracza = obliczPunkty(rekaGracza);
    if (pGracza === 21) {
      const pKrupiera = obliczPunkty(rekaKrupiera);
      zakonczGre(pKrupiera, pGracza, aktualnyZaklad, true);
    } else {
      ustawStanGry('turaGracza');
      ustawKomunikat('Twój ruch');
    }
  }, [rekaKrupiera, rekaGracza, aktualnyZaklad, zakonczGre]);

  const decyzjaUbezpieczenie = useCallback((decyzja) => {
    if (decyzja) {
      const koszt = aktualnyZaklad;
      if (saldo >= koszt) {
        ustawSaldo(s => s - koszt);
        ustawZakladUbezpieczenia(koszt);
        sprawdzBlackjackaPoUbezpieczeniu(true);
      } else {
        sprawdzBlackjackaPoUbezpieczeniu(false);
      }
    } else {
      sprawdzBlackjackaPoUbezpieczeniu(false);
    }
  }, [aktualnyZaklad, saldo, ustawSaldo, sprawdzBlackjackaPoUbezpieczeniu]);

  const startAutoGry = (kwota) => {
    ustawStawkaAuto(kwota);
    ustawCzyAutoGra(true);
    startRundy(kwota);
  };

  const stopAutoGry = () => ustawCzyAutoGra(false);

  useEffect(() => {
    if (!czyAutoGra) return;

    let timer;

    if (stanGry === 'obstawianie') {
      if (saldo < stawkaAuto) {
        ustawCzyAutoGra(false);
        ustawKomunikat('Brak środków na grę automatyczną.');
      } else {
        ustawKomunikat('Rozdawanie kart');
        timer = setTimeout(() => startRundy(stawkaAuto), PREDKOSC_BOTA);
      }
    }
    else if (stanGry === 'turaGracza' && !blokadaDobierania) {
      timer = setTimeout(() => {
        const widocznaKartaKrupiera = rekaKrupiera[1];
        const decyzja = pobierzDecyzjeBota(rekaGracza, widocznaKartaKrupiera);

        if (decyzja === 'hit') {
          ustawKomunikat('Bot dobiera kartę');
          dobierzKarte();
        } else if (decyzja === 'stand') {
          ustawKomunikat('Bot pasuje');
          pasuj();
        } else if (decyzja === 'double') {
          if (saldo >= aktualnyZaklad && rekaGracza.length === 2) {
            ustawKomunikat('Bot podwaja stawkę');
            podwoj();
          } else {
            ustawKomunikat('Bot dobiera kartę (zbyt niska stawka na double)');
            dobierzKarte();
          }
        }
      }, PREDKOSC_BOTA);
    }
    else if (stanGry === 'ubezpieczenie') {
      timer = setTimeout(() => {
        ustawKomunikat('Bot odrzuca ubezpieczenie');
        setTimeout(() => {
            decyzjaUbezpieczenie(false);
        }, 2000);
      }, PREDKOSC_BOTA);
    }
    else if (stanGry === 'wynikUbezpieczenia') {
      timer = setTimeout(() => poPotwierdzeniuUbezpieczenia(), PREDKOSC_BOTA / 2);
    }
    else if (stanGry === 'koniec') {
      timer = setTimeout(() => ustawStanGry('obstawianie'), PREDKOSC_BOTA);
    }

    return () => clearTimeout(timer);
  }, [
    stanGry, czyAutoGra, saldo, stawkaAuto, rekaGracza, rekaKrupiera, 
    blokadaDobierania, startRundy, dobierzKarte, pasuj, podwoj, 
    decyzjaUbezpieczenie, poPotwierdzeniuUbezpieczenia, aktualnyZaklad
  ]);

  useEffect(() => {
    if (stanGry !== 'turaGracza' || czyKoniecGryRef.current) return;
    if (punktyGracza >= 21) {
      const timeoutTime = punktyGracza > 21 ? 1500 : 1000;
      const msg = 'Tura Krupiera';
      const timer = setTimeout(() => {
        ustawKomunikat(msg);
        ustawStanGry('turaKrupiera');
      }, timeoutTime);
      return () => clearTimeout(timer);
    }
  }, [stanGry, punktyGracza]);

  useEffect(() => {
    if (stanGry !== 'turaKrupiera') return;

    if (!czyKartaKrupieraOdkryta) {
      ustawCzyKartaKrupieraOdkryta(true);
      return;
    }

    const pKrupiera = obliczPunkty(rekaKrupiera);
    const zakoncz = () => zakonczGre(pKrupiera, punktyGracza, aktualnyZaklad, false);

    if (punktyGracza > 21 || (punktyGracza === 21 && rekaGracza.length === 2) || pKrupiera >= 17) {
      const timer = setTimeout(zakoncz, 1500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const [nowaTalia, karta] = rozdajKarte(taliaRef.current);
      taliaRef.current = nowaTalia;
      ustawRekeKrupiera((h) => [...h, karta]);
    }, 1500);
    return () => clearTimeout(timer);
  }, [stanGry, rekaKrupiera, punktyGracza, zakonczGre, czyKartaKrupieraOdkryta, aktualnyZaklad, rekaGracza.length]);

  const wynikKrupieraWidoczny = (stanGry === 'turaGracza' || stanGry === 'rozdawanie' || stanGry === 'podwajanie' || stanGry === 'ubezpieczenie' || stanGry === 'wynikUbezpieczenia') && rekaKrupiera.length > 1 && !czyKartaKrupieraOdkryta
    ? obliczPunkty([rekaKrupiera[1]]) 
    : punktyKrupiera;

  return (
    <div className="kontener-gry">
      {stanGry === 'obstawianie' && !czyAutoGra && (
        <ModalZakladu saldo={saldo} startRundy={startRundy} startAutoGry={startAutoGry} powrotDoMenu={powrotDoMenu} resetujGre={resetujGre} />
      )}
      
      <header className="naglowek-gry">
        <div className="wynik-naglowek">Saldo: <span>${saldo}</span></div>
        {czyAutoGra && <button onClick={stopAutoGry} className="przycisk-naglowek stop-auto-header">WYŁĄCZ GRĘ AUTOMATYCZNĄ</button>}
        <button onClick={powrotDoMenu} className="przycisk-naglowek" disabled={(stanGry !== 'obstawianie' && stanGry !== 'koniec') || czyAutoGra}>Powrót do Menu</button>
      </header>

      <div className="plansza">
        <div className="obszar-reki">
          <h2>Krupier (Wynik: {wynikKrupieraWidoczny})</h2>
          <Reka karty={rekaKrupiera} czyGracz={false} stanGry={stanGry} czyKartaKrupieraOdkryta={czyKartaKrupieraOdkryta} />
        </div>

        <div className="status-gry">
          <p className="wiadomosc">{komunikat}</p>
          {stanGry !== 'obstawianie' && stanGry !== 'rozdawanie' && (
            <p className="aktualna-stawka">
              Stawka: ${aktualnyZaklad}{zakladUbezpieczenia > 0 && <span style={{color: '#ffa726', marginLeft: '10px'}}>(Ubezp: ${zakladUbezpieczenia})</span>}
            </p>
          )}
        </div>

        <div className="obszar-reki">
          <h2>Ty {czyAutoGra && '(BOT)'} (Wynik: {punktyGracza})</h2>
          <Reka karty={rekaGracza} czyGracz={true} stanGry={stanGry} />
        </div>
      </div>

      <div className="sterowanie">
        {(!czyAutoGra || stanGry === 'koniec') && (
          <>
            {stanGry === 'turaGracza' && (
              <>
                <button onClick={dobierzKarte} disabled={blokadaDobierania || punktyGracza >= 21}>Dobierz (Hit)</button>
                <button onClick={pasuj} disabled={blokadaDobierania || punktyGracza >= 21}>Pasuj (Stand)</button>
                {rekaGracza.length === 2 && <button onClick={podwoj} disabled={blokadaDobierania || saldo < aktualnyZaklad || punktyGracza >= 21} style={{ opacity: saldo < aktualnyZaklad ? 0.5 : 1, cursor: saldo < aktualnyZaklad ? 'not-allowed' : 'pointer' }}>Podwój (Double)</button>}
              </>
            )}

            {stanGry === 'ubezpieczenie' && (
              <>
                <button onClick={() => decyzjaUbezpieczenie(true)} className="przycisk-nowa-runda" style={{ background: '#ffa726', opacity: saldo < aktualnyZaklad ? 0.5 : 1, cursor: saldo < aktualnyZaklad ? 'not-allowed' : 'pointer' }} disabled={saldo < aktualnyZaklad}>Tak (${aktualnyZaklad})</button>
                <button onClick={() => decyzjaUbezpieczenie(false)} style={{background: '#d32f2f', color: 'white'}}>Nie</button>
              </>
            )}

            {stanGry === 'wynikUbezpieczenia' && <button onClick={poPotwierdzeniuUbezpieczenia} className="przycisk-nowa-runda">OK (Graj dalej)</button>}
            
            {stanGry === 'koniec' && <button onClick={() => ustawStanGry('obstawianie')} className="przycisk-nowa-runda" disabled={czyAutoGra} style={{ opacity: czyAutoGra ? 0.5 : 1, cursor: czyAutoGra ? 'not-allowed' : 'pointer' }}>Nowa Runda</button>}
          </>
        )}
      </div>
    </div>
  );
}