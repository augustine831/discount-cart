import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './EditDiscountModal.css';

interface EditDiscountModalProps {
  show: boolean;
  showAdd: boolean;
  discounts: { id: string; name: string; value: number; enabled: boolean; format?: string }[];
  onHide: () => void;
  discount: {
    id: string;
    name: string;
    value: number;
    enabled: boolean;
    editable: boolean;
    type?: 'one-time' | 'monthly';
    typeLabel?: string;
  } | null;
  onSave: (format: '%' | '€', value: number, priceType?: 'one-time' | 'monthly', duration?: string, description?: string, id?: string) => void;
}

const EditDiscountModal: React.FC<EditDiscountModalProps> = ({ show, showAdd, discounts, onHide, discount, onSave }) => {
  const [discountType, setDiscountType] = useState<'%' | '€'>('%');
  const [discountValue, setDiscountValue] = useState(discount?.value ?? 0);
  const [priceType, setPriceType] = useState<'one-time' | 'monthly'>(discount?.type || 'one-time');
  
  React.useEffect(() => {
    if (discount && discount.type) {
      setPriceType(discount.type);
    } else if (showAdd) {
      setPriceType('one-time');
    }
  }, [discount, showAdd]);
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getDiscounts = (format?: '%' | '€', val?: number) => {
    const appliedDiscounts = discounts.filter(d => d.enabled && d.id !== discount?.id);
    const formatsAndValues: { format: string; value: number }[] = [];
    appliedDiscounts.forEach(d => {
      formatsAndValues.push({ format: d.format || '%', value: d.value });
    });
    formatsAndValues.push({ format: format ?? discountType, value: val ?? discountValue });
    let totalDiscount = 0;
    let subtotal = 1000;
    formatsAndValues.forEach(d => {
      if (d.format === '%') {
        totalDiscount += subtotal * (d.value / 100);
      } else {
        totalDiscount += d.value;
      }
    });    
    setTotal(subtotal - totalDiscount);
  }

  React.useEffect(() => {
    if (show) {
      getDiscounts();
    }
  }, [show]);

  function generateId() {
    return 'discount-' + Math.random().toString(36).substr(2, 9);
  }

  React.useEffect(() => {
    setDiscountValue(discount?.value ?? 0);
  }, [discount]);

  React.useEffect(() => {
    if ((discountType === '%' && discountValue > 5) || (discountType === '€' && discountValue > 50)) {
      setError(discountType === '%' ? 'Discount cannot exceed 5%' : 'Discount cannot exceed 50€');
    } else {
      setError(null);
    }
  }, [discountType, discountValue]);


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        {discount ? <Modal.Title>{discount.name} here</Modal.Title> : <Modal.Title>Add New Discount</Modal.Title>}
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">For which price do you calculate the discount?</div>
          <div className="discount-type-selector mb-3">
            <button
              type="button"
              className={`discount-type-btn${priceType === 'one-time' ? ' active' : ''}`}
              disabled={!showAdd}
              onClick={() => showAdd && setPriceType('one-time')}
            >
              One time price
              <span className="selector-check">
                {priceType === 'one-time' ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="9" fill="none" />
                    <path d="M5 9.5L8 12.5L13 7.5" stroke="#53b8c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="8" fill="#f5f5f5" stroke="#eee" strokeWidth="2" />
                  </svg>
                )}
              </span>
            </button>
            <button
              type="button"
              className={`discount-type-btn${priceType === 'monthly' ? ' active' : ''}`}
              disabled={!showAdd}
              onClick={() => showAdd && setPriceType('monthly')}
            >
              Monthly price
              <span className="selector-check">
                {priceType === 'monthly' ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="9" fill="none" />
                    <path d="M5 9.5L8 12.5L13 7.5" stroke="#53b8c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="8" fill="#f5f5f5" stroke="#eee" strokeWidth="2" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        <Form>
          <Form.Group className="mb-2" controlId="discountType">
            <Form.Label>Discount</Form.Label>
            <div className="d-flex discount-value-input">
              <Form.Select value={discountType} 
              onChange={e => {
                  const val = (e.target.value as '%' | '€');
                  setDiscountType(val);
                  getDiscounts(val, undefined);
                }}
                style={{ width: '80px',}}>
                <option value="%">%</option>
                <option value="€">€</option>
              </Form.Select>
              <Form.Control 
                type="number" 
                value={discountValue} 
                onChange={e => {
                  const val = Number(e.target.value);
                  setDiscountValue(val);
                  getDiscounts(undefined, val);
                }}
                placeholder="Value" 
                isInvalid={!!error}
              />
            </div>
            {!error && <Form.Text className="text-muted">The discount cannot exceed 5% or 50€</Form.Text>}
            {error && <Form.Text className="text-muted error" style={{ color: 'red', marginTop: 4 }}>{error}</Form.Text>}
          </Form.Group>
            {showAdd && (
            <>
            {priceType === 'monthly' && (
              <Form.Group className="mb-2" controlId="duration">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Number of months" />
              </Form.Group>
            )}
              
              <Form.Group className="mb-2" controlId="monthlyDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
              </Form.Group>
            </>
            )}
            
            <Form.Group className="mb-2" controlId="newPrice">
              <Form.Label>New price</Form.Label>
              <Form.Control type="text" value={total} readOnly />
            </Form.Group>
      
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="info" onClick={() => onSave(discountType, discountValue, priceType, duration, description, discount?.id || generateId())} disabled={!!error}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDiscountModal;
