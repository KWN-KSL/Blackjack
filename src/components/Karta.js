import './Karta.css';

export default function Karta({ karta, czyUkryta = false, animacja = false, opoznienie = 0, obrot = false, czyOdwrocona = false }) {
  const stylAnimacji = animacja ? { animationDelay: `${opoznienie}ms` } : {};
  const klasaAnimacji = animacja ? 'pojawienie-karty' : '';

  if (czyUkryta) {
    return <div className={`karta ukryta ${klasaAnimacji}`} style={stylAnimacji} />;
  }

  if (obrot) {
    return (
      <div className={`karta-obrotowa ${czyOdwrocona ? 'odwrocona' : ''} ${klasaAnimacji}`} style={stylAnimacji}>
        <div className="karta-wnetrze">
          <div className="karta-przod"><div className="karta ukryta"></div></div>
          <div className="karta-tyl">
             <WidokKarty karta={karta} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`karta-zwykla ${klasaAnimacji}`} style={stylAnimacji}>
      <WidokKarty karta={karta} />
    </div>
  );
}

function WidokKarty({ karta }) {
  const kolorCss = karta.kolor === '♥' || karta.kolor === '♦' ? 'czerwona' : 'czarna';
  return (
    <div className={`karta ${kolorCss}`}>
      <span className="wartosc">{karta.wartosc}</span>
      <span className="kolor">{karta.kolor}</span>
    </div>
  );
}