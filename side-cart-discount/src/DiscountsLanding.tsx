import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DiscountsLanding.css';
import OverviewCard from './OverviewCard';
import './OverviewCard.css';
import EditDiscountModal from './EditDiscountModal';
import penIcon from './assets/pen.png';
import deleteIcon from './assets/delete.png';

type DiscountType = "one-time" | "monthly";
interface Discount {
  id: string;
  name: string;
  format: '%' | '€';
  value: number;
  editable: boolean;
  new: boolean;
  enabled: boolean;
  type?: DiscountType;
  typeLabel?: string;
  duration?: number;
  description?: string;
}

const initialDiscounts: Discount[] = [
  { id: 'discount-1', name: 'Discount name', format: '€', value: 250, editable: false, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
  { id: 'discount-2', name: 'Discount name', format: '%', value: 50, editable: true, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
  { id: 'discount-3', name: 'Discount name', format: '€', value: 250, editable: false, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
  { id: 'discount-4', name: 'Discount name', format: '€', value: 0, editable: false, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
  { id: 'discount-5', name: 'Discount name', format: '€', value: 250, editable: false, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
  { id: 'discount-6', name: 'Discount name', format: '%', value: 50, editable: true, new: false, enabled: false, type: 'monthly', typeLabel: "Monthly", duration:3 },
  { id: 'discount-7', name: 'Discount name', format: '€', value: 25, editable: false, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
  { id: 'discount-8', name: 'Discount name', format: '€', value: 25, editable: false, new: false, enabled: false, type: 'one-time', typeLabel: "One Time" },
];

function generateId() {
  return 'discount-' + Math.random().toString(36).substr(2, 9);
}


const DiscountsLanding: React.FC = () => {
  const [discounts, setDiscounts] = React.useState(initialDiscounts);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showAddDiscount, setShowAddDiscount] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [totalOnetimeCosts, setTotalOnetimeCosts] = React.useState(1000);
  const [discountedMonthly, setDiscountedMonthly] = React.useState(0);
  const [normalMonthly, setNormalMonthly] = React.useState(0);
  const [discountMonths, setDiscountMonths] = React.useState(0);

  React.useEffect(() => {
    // Base onetime price
    let baseOnetime = 1000;
    // Apply one-time discounts
    const enabledOnetime = discounts.filter(d => d.enabled && d.type === 'one-time');
    let onetimeDiscount = 0;
    enabledOnetime.forEach(d => {
      if (d.format === '%') {
        onetimeDiscount += baseOnetime * (d.value / 100);
      } else {
        onetimeDiscount += d.value;
      }
    });
    let discountedOnetime = baseOnetime - onetimeDiscount;
    setTotalOnetimeCosts(discountedOnetime);

    // Calculate base monthly price after one-time discounts
    let baseMonthly = discountedOnetime / 12;
    let discountedMonthly = baseMonthly;
    let discountMonths = 0;

    // Find the first enabled monthly discount with duration
    const enabledMonthly = discounts.filter(d => d.enabled && d.type === 'monthly' && d.duration);
    if (enabledMonthly.length > 0) {
      const d = enabledMonthly[0];
      discountMonths = d.duration || 0;
      if (d.format === '%') {
        discountedMonthly = baseMonthly - (baseMonthly * d.value / 100);
      } else {
        discountedMonthly = baseMonthly - d.value;
      }
    }
    setDiscountedMonthly(discountedMonthly);
    setNormalMonthly(baseMonthly);
    setDiscountMonths(discountMonths);
  }, [discounts]);

  return (
    <div className="discounts-landing" style={{ display: 'flex', gap: 32 }}>
      <div>
        <div className="discounts-header">Discounts
        </div>
        <div className="add-discounts">
          <span
            className="add-manual"
            onClick={() => {
              setEditIndex(null);
              setShowEditModal(true);
              setShowAddDiscount(true);
            }}
          >
            + Add manual discount
          </span></div>
        <table className="discounts-table">
          <tbody>
            {discounts.map((d, i) => (
              <tr key={i}>
                <td className="discount-name">{d.name}</td>
                <td className="discount-value">
                  {d.editable && !d.new && (
                    <span
                      className="edit-icon"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setEditIndex(i);
                        setShowEditModal(true);
                        setShowAddDiscount(false);
                      }}
                    >
                      <img src={penIcon} alt="edit discount" />
                    </span>
                  )}
                    - {d.format === '%' ? `${d.value}%` : `€ ${d.value},00`} {d.typeLabel}
                    {d.type === 'monthly' && d.duration ? ` first ${d.duration} month${d.duration > 1 ? 's' : ''}` : ''}
                </td>
                <td className="discount-switch-cell">
                  { 
                    d.new ? (
                      <div style={{ display: 'inline' }}>
                        <span
                          className="edit-icon"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setEditIndex(i);
                            setShowEditModal(true);
                            setShowAddDiscount(false);
                          }}
                        >
                          <img src={penIcon} alt="edit manual discount" />
                        </span>
                        <span
                          className="delete-icon"
                          style={{ cursor: 'pointer', marginLeft: 8, color: 'red' }}
                          onClick={() => {
                            const updatedDiscounts = discounts.filter((_, idx) => idx !== i);
                            setDiscounts(updatedDiscounts);
                          }}
                        >
                          <img src={deleteIcon} alt="delete manual discount" />
                        </span>
                      </div>
                    ) : (
                      <input
                        type="checkbox"
                        checked={d.enabled}
                        onChange={() => {
                          const updatedDiscounts = discounts.map((discount, idx) =>
                            idx === i ? { ...discount, enabled: !discount.enabled } : discount
                          );
                          setDiscounts(updatedDiscounts);
                        }}
                        className={`discount-switch${d.enabled ? ' enabled' : ''}`}
                      />
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="discounts-footer">
          <button className="footer-btn">Previous</button>
          <button className="footer-btn next">Next</button>
        </div>
        <div className="discounts-nav">
          <div>Klantgegevens</div>
          <div>Productgegevens</div>
          <div>Checkout</div>
        </div>
      </div>
      <div>
        <OverviewCard
          monthlyPrice={normalMonthly}
          discountedMonthlyPrice={discountedMonthly}
          discountMonths={discountMonths}
          onetimePrice={totalOnetimeCosts}
          totalOnetimeCosts={totalOnetimeCosts}
          discounts={discounts}
        />
      </div>
      
        <EditDiscountModal
          show={showEditModal}
          showAdd={showAddDiscount}
          discounts={discounts}
          onHide={() => {
            setShowEditModal(false);
            setShowAddDiscount(false);
            setEditIndex(null);
          }}
          discount={editIndex !== null ? discounts[editIndex] : null}
          onSave={(format, value, priceType, duration, description, id) => {
            if (showAddDiscount) {
              setDiscounts([
                ...discounts,
                {
                  id: id || generateId(),
                  name: 'Manual Discount',
                  format: format,
                  value,
                  enabled: true,
                  editable: true,
                  new: true,
                  type: priceType,
                  typeLabel: priceType === 'monthly' ? 'Monthly' : 'One Time',
                  duration: duration !== undefined ? Number(duration) : undefined,
                  description,
                },
              ]);
              
            } else if (editIndex !== null) {
              const updatedDiscounts = discounts.map((d, idx) =>
                idx === editIndex ? { ...d, value, id: d.id } : d
              );
              setDiscounts(updatedDiscounts);
            }
            setShowEditModal(false);
            setShowAddDiscount(false);
            setEditIndex(null);
          }}
        />
    </div>
  );
}

export default DiscountsLanding;
