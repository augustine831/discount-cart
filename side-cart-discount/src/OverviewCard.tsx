import React from 'react';
import './OverviewCard.css';
import chargerImg from './assets/charger.jpg'; 

interface OverviewCardProps {
  monthlyPrice: number;
  onetimePrice: number;
  discounts: { name: string; value: number; enabled: boolean; format?: string }[];
  totalOnetimeCosts: number;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ monthlyPrice, onetimePrice, discounts, totalOnetimeCosts }) => {
  const enabledDiscounts = discounts.filter(d => d.enabled);

  return (
    <div className="overview-card">
      <div className="overview-top">
        <img src={chargerImg} alt="charger" className="overview-img" />
        <h2 className="overview-title">Overview</h2>
        <div className="overview-row">
          <span>Webasto Pure II laadpaal type 2</span>
          <span>€ {onetimePrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="overview-row overview-row-italic">
          <span>Maandelijkse prijs</span>
          <span>€ {monthlyPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="overview-row overview-row-link">
          <span className="overview-edit">Edit</span>
        </div>
      </div>
      <div className="overview-section overview-highlight">
        <span><b>Eventually per month excl. btw</b></span>
        <span><b>€ {monthlyPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</b></span>
      </div>
      <div className="overview-section-sep" />
      <div className="overview-section">
        <div className="overview-row">
          <span>Subtotal onetime costs excl. btw</span>
          <span>€ {onetimePrice.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
        </div>
        {enabledDiscounts.map((d, i) => (
          <div className="overview-row overview-row-italic" key={i}>
            <span>{d.name}</span>
            <span>
              - {d.format === '%' ? `${d.value}%` : `€ ${d.value.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`}
            </span>
          </div>
        ))}
        <div className="overview-row overview-row-bold">
          <span>Onetime costs excl. btw</span>
          <span>€ {totalOnetimeCosts.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
