import Karta from './Karta';
import './Reka.css';

export default function Reka({ karty, czyGracz, stanGry, czyKartaKrupieraOdkryta }) {
  if (stanGry === 'obstawianie') {
    return (
      <div className="reka">
        <div className="placeholder"></div>
        <div className="placeholder" style={{ animationDelay: '0.2s' }}></div>
      </div>
    );
  }

  return (
    <div className="reka">
      {karty.map((karta, i) => {
        if (czyGracz) {
          return <Karta key={`g-${i}`} karta={karta} animacja={true} opoznienie={i * 100} />;
        } else {
          if (i === 0) {
            return <Karta key="k-0" karta={karta} animacja={true} opoznienie={0} obrot={true} czyOdwrocona={czyKartaKrupieraOdkryta} />;
          }
          return <Karta key={`k-${i}`} karta={karta} animacja={true} opoznienie={i > 1 ? 0 : 100} />;
        }
      })}
    </div>
  );
}