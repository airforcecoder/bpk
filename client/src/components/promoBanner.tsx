import { promoBanner } from "../data/promoBanner";
import "./PromoBanner.css";

export default function PromoBanner() {
  const { messages, separator, speedSeconds } = promoBanner;
  const set = Array.from({ length: 4 }).flatMap(() => messages);

  const renderGroup = (hidden: boolean) => (
    <ul className="promo-banner__group" aria-hidden={hidden}>
      {set.map((text, i) => (
        <li key={i} className="promo-banner__item">
          {text}
          <span className="promo-banner__sep">{separator}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className="promo-banner"
      aria-label="Promotion: $10 Tuesdays, $4 off selfies"
    >
      <div
        className="promo-banner__track"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </section>
  );
}