'use client';

import { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/PageHeader';

type CheckoutStep = 'shipping' | 'billing' | 'payment' | 'email-confirmation' | 'confirmation';

// Validation regex patterns
const REGEX = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10,15}$/,
  address: /^[a-zA-Z0-9\s,.-]{3,100}$/,
  city: /^[a-zA-Z\s]{2,50}$/,
  postalCode: /^\d{5,6}$/,
};

const PAKISTAN_PROVINCES = [
  'Sindh',
  'Punjab',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir',
  'Islamabad Capital Territory',
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartContext();
  const { user, isLoggedIn } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Form states
  const [shippingData, setShippingData] = useState({
    customer_first_name: '',
    customer_last_name: '',
    customer_email: '',
    customer_phone: '',
    street_address: '',
    city: '',
    province: '',
    postal_code: '',
  });

  // Auto-fill user data when logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setShippingData((prev) => ({
        ...prev,
        customer_first_name: user.name.split(' ')[0] || '',
        customer_last_name: user.name.split(' ').slice(1).join(' ') || '',
        customer_email: user.email || '',
      }));
    }
  }, [isLoggedIn, user]);

  const [shippingErrors, setShippingErrors] = useState<Record<string, boolean>>({});

  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    street_address: '',
    city: '',
    province: '',
    postal_code: '',
  });

  const [billingErrors, setBillingErrors] = useState<Record<string, boolean>>({});

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNumber, setOrderNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [mockOtp, setMockOtp] = useState(''); // For demo purposes

  // Calculations
  const subtotal = total;
  const tax_amount = (subtotal - promoDiscount) * 0.17;
  const shipping_amount = subtotal > 5000 ? 0 : 300;
  const finalTotal = subtotal - promoDiscount + tax_amount + shipping_amount;

  // Promo code validation
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.toUpperCase().trim();

    // Mock promo codes for demo
    const validPromos: Record<string, number> = {
      'SAVE10': 0.10, // 10% off
      'SAVE20': 0.20, // 20% off
      'WELCOME': 0.15, // 15% off
    };

    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (validPromos[code]) {
      const discount = subtotal * validPromos[code];
      setPromoDiscount(discount);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
    }
  };

  // Validation functions
  const validateShipping = (): boolean => {
    const errors: Record<string, boolean> = {};

    if (!REGEX.name.test(shippingData.customer_first_name)) {
      errors.customer_first_name = true;
    }
    if (shippingData.customer_last_name && !REGEX.name.test(shippingData.customer_last_name)) {
      errors.customer_last_name = true;
    }
    if (!REGEX.email.test(shippingData.customer_email)) {
      errors.customer_email = true;
    }
    if (!REGEX.phone.test(shippingData.customer_phone)) {
      errors.customer_phone = true;
    }
    if (!REGEX.address.test(shippingData.street_address)) {
      errors.street_address = true;
    }
    if (!REGEX.city.test(shippingData.city)) {
      errors.city = true;
    }
    if (!shippingData.province) {
      errors.province = true;
    }
    if (!REGEX.postalCode.test(shippingData.postal_code)) {
      errors.postal_code = true;
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBilling = (): boolean => {
    if (billingData.sameAsShipping) return true;

    const errors: Record<string, boolean> = {};

    if (!REGEX.address.test(billingData.street_address)) {
      errors.street_address = true;
    }
    if (!REGEX.city.test(billingData.city)) {
      errors.city = true;
    }
    if (!billingData.province) {
      errors.province = true;
    }
    if (!REGEX.postalCode.test(billingData.postal_code)) {
      errors.postal_code = true;
    }

    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setCurrentStep('billing');
    }
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateBilling()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('email-confirmation');
  };

  const handleEmailConfirmation = () => {
    // Generate a 6-digit OTP for demo
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setOtpSent(true);
    setOtp('');
    setOtpError('');
    
    // TODO: Send OTP to email via backend API
    console.log(`OTP sent to ${shippingData.customer_email}: ${generatedOtp}`);
  };

  const handleOtpVerification = () => {
    if (otp === mockOtp) {
      setOtpError('');
      
      // Build order payload matching backend DTO
      const orderPayload = {
        customer_email: shippingData.customer_email,
        customer_phone: shippingData.customer_phone,
        customer_first_name: shippingData.customer_first_name,
        customer_last_name: shippingData.customer_last_name,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          sku: item.sku,
          product_size: item.product_size,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        shipping_address: {
          street_address: shippingData.street_address,
          city: shippingData.city,
          province: shippingData.province,
          postal_code: shippingData.postal_code,
          phone: shippingData.customer_phone,
        },
        billing_address: billingData.sameAsShipping ? undefined : {
          street_address: billingData.street_address,
          city: billingData.city,
          province: billingData.province,
          postal_code: billingData.postal_code,
        },
        tax_amount: Math.round(tax_amount),
        shipping_amount,
        payment_method: paymentMethod,
      };

      // TODO: Send to backend API
      console.log('Order payload:', orderPayload);

      const orderNum = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setOrderNumber(orderNum);
      
      // Clear cart after successful order
      clearCart();
      
      setCurrentStep('confirmation');
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader />

      <section
        style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '32px', letterSpacing: '-0.5px' }}>
            Checkout
          </h1>

          {items.length === 0 && currentStep !== 'confirmation' ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
              <p style={{ fontSize: '1.1rem', color: '#666666', marginBottom: '24px' }}>
                Your cart is empty
              </p>
              <a
                href="/products"
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: currentStep === 'confirmation' ? '1fr' : '1.5fr 1fr', gap: '60px' }}>
              {/* Main Content */}
              <div>
                {/* Progress Steps */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '48px', alignItems: 'center', justifyContent: 'center' }}>
                  {(['shipping', 'billing', 'payment', 'email-confirmation', 'confirmation'] as CheckoutStep[]).map((step, idx) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: currentStep === step || (currentStep === 'confirmation' && step !== 'confirmation') ? '#000000' : '#e0e0e0',
                          color: currentStep === step || (currentStep === 'confirmation' && step !== 'confirmation') ? '#ffffff' : '#999999',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'capitalize', color: currentStep === step ? '#000000' : '#999999' }}>
                        {step === 'email-confirmation' ? 'Confirm Email' : step}
                      </span>
                      {idx < 4 && <div style={{ width: '24px', height: '1px', background: '#e0e0e0' }} />}
                    </div>
                  ))}
                </div>

                {/* Shipping Form */}
                {currentStep === 'shipping' && (
                  <form onSubmit={handleShippingSubmit}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Shipping Address</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <input
                          type="text"
                          placeholder="First Name"
                          value={shippingData.customer_first_name}
                          onChange={(e) => setShippingData({ ...shippingData, customer_first_name: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.customer_first_name ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box'
                          }}
                        />
                        {shippingErrors.customer_first_name && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid name required (2-50 chars)</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={shippingData.customer_last_name}
                          onChange={(e) => setShippingData({ ...shippingData, customer_last_name: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.customer_last_name ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box'
                          }}
                        />
                        {shippingErrors.customer_last_name && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid name required</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <input
                          type="email"
                          placeholder="Email"
                          value={shippingData.customer_email}
                          onChange={(e) => setShippingData({ ...shippingData, customer_email: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.customer_email ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box'
                          }}
                        />
                        {shippingErrors.customer_email && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid email required</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', border: shippingErrors.customer_phone ? '2px solid #c0392b' : '1px solid #e0e0e0', borderRadius: '4px', padding: '0 12px' }}>
                          <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.14.0/flags/4x3/pk.svg" alt="Pakistan" style={{ width: '24px', height: '18px' }} />
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#666666' }}>+92</span>
                          <input
                            type="tel"
                            placeholder="Phone (10-15 digits)"
                            value={shippingData.customer_phone}
                            onChange={(e) => setShippingData({ ...shippingData, customer_phone: e.target.value })}
                            style={{ flex: 1, border: 'none', fontSize: '14px', fontFamily: 'system-ui', padding: '12px 0', outline: 'none' }}
                          />
                        </div>
                        {shippingErrors.customer_phone && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid phone required (10-15 digits)</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={shippingData.street_address}
                          onChange={(e) => setShippingData({ ...shippingData, street_address: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.street_address ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box'
                          }}
                        />
                        {shippingErrors.street_address && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid address required (3-100 chars)</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.city ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box'
                          }}
                        />
                        {shippingErrors.city && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid city required</p>}
                      </div>
                      <div>
                        <select
                          value={shippingData.province}
                          onChange={(e) => setShippingData({ ...shippingData, province: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.province ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Select Province</option>
                          {PAKISTAN_PROVINCES.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                        {shippingErrors.province && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Province required</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={shippingData.postal_code}
                          onChange={(e) => setShippingData({ ...shippingData, postal_code: e.target.value })}
                          style={{ 
                            width: '100%',
                            padding: '12px', 
                            border: shippingErrors.postal_code ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                            fontSize: '14px', 
                            fontFamily: 'system-ui',
                            boxSizing: 'border-box'
                          }}
                        />
                        {shippingErrors.postal_code && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid postal code required (5-6 digits)</p>}
                      </div>
                    </div>
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: '#000000',
                        color: '#ffffff',
                        border: '1px solid #000000',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'system-ui',
                      }}
                    >
                      Continue to Billing
                    </button>
                  </form>
                )}

                {/* Billing Form */}
                {currentStep === 'billing' && (
                  <form onSubmit={handleBillingSubmit}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Billing Address</h2>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={billingData.sameAsShipping}
                        onChange={(e) => setBillingData({ ...billingData, sameAsShipping: e.target.checked })}
                        style={{ cursor: 'pointer' }}
                      />
                      Same as shipping address
                    </label>

                    {!billingData.sameAsShipping && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={billingData.street_address}
                            onChange={(e) => setBillingData({ ...billingData, street_address: e.target.value })}
                            style={{ 
                              width: '100%',
                              padding: '12px', 
                              border: billingErrors.street_address ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                              fontSize: '14px', 
                              fontFamily: 'system-ui',
                              boxSizing: 'border-box'
                            }}
                          />
                          {billingErrors.street_address && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid address required</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={billingData.city}
                            onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                            style={{ 
                              width: '100%',
                              padding: '12px', 
                              border: billingErrors.city ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                              fontSize: '14px', 
                              fontFamily: 'system-ui',
                              boxSizing: 'border-box'
                            }}
                          />
                          {billingErrors.city && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid city required</p>}
                        </div>
                        <div>
                          <select
                            value={billingData.province}
                            onChange={(e) => setBillingData({ ...billingData, province: e.target.value })}
                            style={{ 
                              width: '100%',
                              padding: '12px', 
                              border: billingErrors.province ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                              fontSize: '14px', 
                              fontFamily: 'system-ui',
                              boxSizing: 'border-box',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Select Province</option>
                            {PAKISTAN_PROVINCES.map(province => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                          {billingErrors.province && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Province required</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Postal Code"
                            value={billingData.postal_code}
                            onChange={(e) => setBillingData({ ...billingData, postal_code: e.target.value })}
                            style={{ 
                              width: '100%',
                              padding: '12px', 
                              border: billingErrors.postal_code ? '2px solid #c0392b' : '1px solid #e0e0e0', 
                              fontSize: '14px', 
                              fontFamily: 'system-ui',
                              boxSizing: 'border-box'
                            }}
                          />
                          {billingErrors.postal_code && <p style={{ fontSize: '12px', color: '#c0392b', margin: '4px 0 0' }}>Valid postal code required</p>}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep('shipping')}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: '#ffffff',
                          color: '#000000',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: '#000000',
                          color: '#ffffff',
                          border: '1px solid #000000',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}

                {/* Payment Form */}
                {currentStep === 'payment' && (
                  <form onSubmit={handlePaymentSubmit}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Payment Method</h2>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #e0e0e0', cursor: 'pointer', marginBottom: '12px' }}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Cash on Delivery</p>
                          <p style={{ fontSize: '12px', color: '#666666', margin: '4px 0 0' }}>Pay when your order arrives</p>
                        </div>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep('billing')}
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: '#ffffff',
                          color: '#000000',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '14px',
                          background: '#000000',
                          color: '#ffffff',
                          border: '1px solid #000000',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        Place Order
                      </button>
                    </div>
                  </form>
                )}

                {/* Email Confirmation */}
                {currentStep === 'email-confirmation' && (
                  <div>
                    {!otpSent ? (
                      <div style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Verify Your Email</h2>
                        <p style={{ fontSize: '1rem', color: '#666666', marginBottom: '32px' }}>
                          We'll send a verification code to<br />
                          <strong>{shippingData.customer_email}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setCurrentStep('payment')}
                            style={{
                              padding: '14px 32px',
                              background: '#ffffff',
                              color: '#000000',
                              border: '1px solid #e0e0e0',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'system-ui',
                            }}
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleEmailConfirmation}
                            style={{
                              padding: '14px 32px',
                              background: '#000000',
                              color: '#ffffff',
                              border: '1px solid #000000',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'system-ui',
                            }}
                          >
                            Send OTP
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Enter Verification Code</h2>
                        <p style={{ fontSize: '0.95rem', color: '#666666', marginBottom: '24px' }}>
                          We've sent a 6-digit code to {shippingData.customer_email}
                        </p>
                        <div style={{ marginBottom: '24px' }}>
                          <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => {
                              setOtp(e.target.value.slice(0, 6));
                              setOtpError('');
                            }}
                            maxLength={6}
                            style={{
                              width: '100%',
                              padding: '14px',
                              border: otpError ? '2px solid #c0392b' : '1px solid #e0e0e0',
                              fontSize: '18px',
                              fontFamily: 'monospace',
                              textAlign: 'center',
                              letterSpacing: '8px',
                              boxSizing: 'border-box',
                            }}
                          />
                          {otpError && <p style={{ fontSize: '12px', color: '#c0392b', margin: '8px 0 0' }}>{otpError}</p>}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#999999', marginBottom: '24px' }}>
                          For demo: OTP is <strong>{mockOtp}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp('');
                              setOtpError('');
                            }}
                            style={{
                              flex: 1,
                              padding: '14px',
                              background: '#ffffff',
                              color: '#000000',
                              border: '1px solid #e0e0e0',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'system-ui',
                            }}
                          >
                            Resend OTP
                          </button>
                          <button
                            type="button"
                            onClick={handleOtpVerification}
                            disabled={otp.length !== 6}
                            style={{
                              flex: 1,
                              padding: '14px',
                              background: otp.length === 6 ? '#000000' : '#e0e0e0',
                              color: otp.length === 6 ? '#ffffff' : '#999999',
                              border: `1px solid ${otp.length === 6 ? '#000000' : '#e0e0e0'}`,
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
                              fontFamily: 'system-ui',
                            }}
                          >
                            Verify & Place Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Confirmation */}
                {currentStep === 'confirmation' && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', width: '100%' }}>
                    <div style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px', maxWidth: '500px', margin: '0 auto' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>Order Confirmed!</h2>
                      <p style={{ fontSize: '1rem', color: '#666666', marginBottom: '24px' }}>
                        Thank you for your order. Your order number is:
                      </p>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace', marginBottom: '32px', letterSpacing: '1px' }}>
                        {orderNumber}
                      </p>
                      <p style={{ fontSize: '0.95rem', color: '#666666', marginBottom: '32px', lineHeight: 1.6 }}>
                        We've sent a confirmation email to {shippingData.customer_email}. You can track your order status there.
                      </p>
                      <a
                        href="/products"
                        style={{
                          display: 'inline-block',
                          padding: '12px 32px',
                          background: '#000000',
                          color: '#ffffff',
                          border: '1px solid #000000',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                      >
                        Continue Shopping
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              {currentStep !== 'confirmation' && (
              <div style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                <div style={{ border: '1px solid #e0e0e0', padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Order Summary
                  </h3>

                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                    {items.map((item) => (
                      <div key={`${item.product_id}-${item.product_size}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                        <span>{item.product_name} x {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>PKR {(item.unit_price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666666' }}>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>PKR {subtotal.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666666' }}>Tax (17%)</span>
                    <span style={{ fontWeight: 600 }}>PKR {Math.round(tax_amount).toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.95rem', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                    <span style={{ color: '#666666' }}>Shipping {shipping_amount === 0 ? '(Free)' : ''}</span>
                    <span style={{ fontWeight: 600 }}>PKR {shipping_amount.toLocaleString()}</span>
                  </div>

                  {/* Promo Code Section */}
                  <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', marginBottom: '8px' }}>
                      Promo Code
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError('');
                        }}
                        placeholder="Enter code"
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: promoError ? '2px solid #c0392b' : '1px solid #e0e0e0',
                          fontSize: '13px',
                          fontFamily: 'system-ui',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={handleApplyPromo}
                        style={{
                          padding: '10px 16px',
                          background: '#000000',
                          color: '#ffffff',
                          border: '1px solid #000000',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p style={{ fontSize: '12px', color: '#c0392b', margin: '6px 0 0' }}>{promoError}</p>
                    )}
                    {promoDiscount > 0 && (
                      <p style={{ fontSize: '12px', color: '#1a7a4a', margin: '6px 0 0', fontWeight: 600 }}>
                        Discount applied: PKR {Math.round(promoDiscount).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666666' }}>Discount</span>
                    <span style={{ fontWeight: 600, color: promoDiscount > 0 ? '#1a7a4a' : '#000000' }}>
                      {promoDiscount > 0 ? '-' : ''}PKR {Math.round(promoDiscount).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>PKR {Math.round(finalTotal).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '60px',
          background: '#1a1a1a',
          color: '#ffffff',
          borderTop: '1px solid #333333',
          marginTop: '60px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {[
            {
              title: 'Shop',
              links: ['All Collections', 'Premium Pret', 'Octa West', 'Desire', 'Sale'],
            },
            {
              title: 'Customer Care',
              links: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ'],
            },
            {
              title: 'About',
              links: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'],
            },
            {
              title: 'Connect',
              links: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'WhatsApp'],
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a
                      href="#"
                      style={{
                        fontSize: '0.9rem',
                        color: '#cccccc',
                        cursor: 'pointer',
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid #333333',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#999999',
          }}
        >
          <p>© 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ cursor: 'pointer' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ cursor: 'pointer' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
