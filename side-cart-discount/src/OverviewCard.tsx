import React from 'react';
import './OverviewCard.css';
import chargerImg from './assets/charger.jpg'; 

interface Discount {
  name: string;
  value: number;
  enabled: boolean;
  format?: string;
  type?: string;
  duration?: number;
}

interface OverviewCardProps {
  monthlyPrice: number;
  discountedMonthlyPrice?: number;
  discountMonths?: number;
  onetimePrice: number;
  totalOnetimeCosts: number;
  discounts: Discount[];
}

const OverviewCard: React.FC<OverviewCardProps> = ({ monthlyPrice, discountedMonthlyPrice, discountMonths, onetimePrice, totalOnetimeCosts, discounts }) => {
  const enabledDiscounts = discounts.filter(d => d.enabled);

  let firstMonths = 0;
  let restMonths = 0;
  let firstMonthsLabel = '';
  let restMonthsLabel = '';
  if (discountedMonthlyPrice !== undefined && discountMonths && discountMonths > 0) {
    firstMonths = discountedMonthlyPrice * discountMonths;
    restMonths = monthlyPrice * (12 - discountMonths);
    firstMonthsLabel = `First ${discountMonths} months`;
    restMonthsLabel = `Next ${12 - discountMonths} months`;
  }

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
        {/* Monthly discount summary */}
        {discountedMonthlyPrice !== undefined && discountMonths && discountMonths > 0 && (
          <>
            <div className="overview-row overview-row-bold">
              <span>{firstMonthsLabel}</span>
              <span>€ {firstMonths.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="overview-row overview-row-bold">
              <span>{restMonthsLabel}</span>
              <span>€ {restMonths.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
