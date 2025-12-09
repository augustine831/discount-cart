import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


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

  const getDiscounts = () => {
    const appliedDiscounts = discounts.filter(d => d.enabled && d.id !== discount?.id);
    const formatsAndValues: { format: string; value: number }[] = [];
    appliedDiscounts.forEach(d => {
      formatsAndValues.push({ format: d.format || '%', value: d.value });
    });
    formatsAndValues.push({ format: discountType, value: discountValue });
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

  function generateId() {
    return 'discount-' + Math.random().toString(36).substr(2, 9);
  }

  React.useEffect(() => {
    setDiscountValue(discount?.value ?? 0);
  }, [discount]);


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        {discount ? <Modal.Title>{discount.name} here</Modal.Title> : <Modal.Title>Add New Discount</Modal.Title>}
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">For which price do you calculate the discount?</div>
        <div className="d-flex mb-3">
          <Button
            variant={priceType === 'one-time' ? 'info' : 'outline-info'}
            active={priceType === 'one-time'}
            disabled={!showAdd ? true : false}
            onClick={() => showAdd && setPriceType('one-time')}
          >
            One time price
          </Button>
          <Button
            variant={priceType === 'monthly' ? 'info' : 'outline-info'}
            active={priceType === 'monthly'}
            className="ms-2"
            disabled={!showAdd ? true : false}
            onClick={() => showAdd && setPriceType('monthly')}
          >
            Monthly price
          </Button>
        </div>
        <Form>
          <Form.Group className="mb-2" controlId="discountType">
            <Form.Label>Discount</Form.Label>
            <div className="d-flex">
              <Form.Select value={discountType} onChange={e => setDiscountType(e.target.value as '%' | '€')} style={{ width: '80px', marginRight: '8px' }}>
                <option value="%">%</option>
                <option value="€">€</option>
              </Form.Select>
              <Form.Control 
                type="number" 
                value={discountValue} 
                onChange={e => setDiscountValue(Number(e.target.value))} 
                onKeyUp={getDiscounts} 
                placeholder="Value" 
              />
            </div>
            <Form.Text className="text-muted">The discount cannot exceed 5%</Form.Text>
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
        <Button variant="info" onClick={() => onSave(discountType, discountValue, priceType, duration, description, discount?.id || generateId())}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDiscountModal;
