export const KOLORY = ['♥', '♦', '♣', '♠'];
export const WARTOSCI = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const PUNKTY_STARTOWE = 1000;

export function stworzTalie() {
  const talia = [];
  for (const kolor of KOLORY) {
    for (const wartosc of WARTOSCI) {
      talia.push({ kolor, wartosc });
    }
  }
  return przetasujTalie(talia);
}

export function przetasujTalie(talia) {
  const nowa = [...talia];
  for (let i = nowa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nowa[i], nowa[j]] = [nowa[j], nowa[i]];
  }
  return nowa;
}

export function obliczPunkty(reka) {
  let punkty = 0;
  let asy = 0;
  for (const karta of reka) {
    if (karta.wartosc === 'A') {
      asy++;
      punkty += 11;
    } else if (['J', 'Q', 'K'].includes(karta.wartosc)) {
      punkty += 10;
    } else {
      punkty += parseInt(karta.wartosc, 10);
    }
  }
  while (punkty > 21 && asy > 0) {
    punkty -= 10;
    asy--;
  }
  return punkty;
}

export function rozdajKarte(talia) {
  const nowaTalia = [...talia];
  const karta = nowaTalia.pop();
  return [nowaTalia, karta];
}