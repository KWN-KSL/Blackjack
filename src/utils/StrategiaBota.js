import { obliczPunkty } from './logikaGry';

export function pobierzDecyzjeBota(rekaGracza, kartaKrupiera) {
  const punkty = obliczPunkty(rekaGracza);
  const liczbaKart = rekaGracza.length;
  const mozePodwoic = liczbaKart === 2;

  let wartoscKrupiera = 0;
  if (['J', 'Q', 'K', '10'].includes(kartaKrupiera.wartosc)) wartoscKrupiera = 10;
  else if (kartaKrupiera.wartosc === 'A') wartoscKrupiera = 11;
  else wartoscKrupiera = parseInt(kartaKrupiera.wartosc, 10);

  const maAsa = rekaGracza.some(k => k.wartosc === 'A');
  
  const punktyMin = rekaGracza.reduce((acc, k) => {
    if (['J', 'Q', 'K'].includes(k.wartosc)) return acc + 10;
    if (k.wartosc === 'A') return acc + 1;
    return acc + parseInt(k.wartosc, 10);
  }, 0);

  const miekkaReka = maAsa && punkty <= 21 && (punkty === punktyMin + 10);

  if (miekkaReka) {
    if (punkty >= 19) return 'stand';

    if (punkty === 18) {
      if (wartoscKrupiera >= 3 && wartoscKrupiera <= 6) {
        return mozePodwoic ? 'double' : 'stand';
      }
      if (wartoscKrupiera === 2 || wartoscKrupiera === 7 || wartoscKrupiera === 8) return 'stand';
      return 'hit';
    }

    if (punkty === 17) {
      if (wartoscKrupiera >= 3 && wartoscKrupiera <= 6) return mozePodwoic ? 'double' : 'hit';
      return 'hit';
    }

    if (punkty === 15 || punkty === 16) {
      if (wartoscKrupiera >= 4 && wartoscKrupiera <= 6) return mozePodwoic ? 'double' : 'hit';
      return 'hit';
    }

    if (punkty === 13 || punkty === 14) {
      if (wartoscKrupiera >= 5 && wartoscKrupiera <= 6) return mozePodwoic ? 'double' : 'hit';
      return 'hit';
    }

    if (punkty === 12) {
      return 'hit'; 
    }
  }

  if (punkty >= 17) return 'stand';

  if (punkty >= 13 && punkty <= 16) {
    if (wartoscKrupiera >= 2 && wartoscKrupiera <= 6) return 'stand';
    return 'hit';
  }

  if (punkty === 12) {
    if (wartoscKrupiera >= 4 && wartoscKrupiera <= 6) return 'stand';
    return 'hit';
  }

  if (punkty === 11) {
    if (wartoscKrupiera === 11) return 'hit';
    return mozePodwoic ? 'double' : 'hit';
  }

  if (punkty === 10) {
    if (wartoscKrupiera < 10) return mozePodwoic ? 'double' : 'hit';
    return 'hit';
  }

  if (punkty === 9) {
    if (wartoscKrupiera >= 3 && wartoscKrupiera <= 6) return mozePodwoic ? 'double' : 'hit';
    return 'hit';
  }

  return 'hit';
}