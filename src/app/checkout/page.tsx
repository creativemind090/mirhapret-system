'use client';

import { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';
import { FiLock } from 'react-icons/fi';

type CheckoutStep = 'shipping' | 'billing' | 'payment' | 'email-confirmation' | 'confirmation';

const REGEX = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10,15}$/,
  address: /^[a-zA-Z0-9\s,.\-/#&'()]{3,250}$/,
  city: /^[a-zA-Z\s]{2,50}$/,
  postalCode: /^\d{5,6}$/,
};

const PAKISTAN_PROVINCES = [
  'Sindh', 'Punjab', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Gilgit-Baltistan', 'Azad Jammu and Kashmir', 'Islamabad Capital Territory',
];

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

// Shared input style
const inp = (hasError: boolean): React.CSSProperties => ({
  width: '100%', padding: '13px 14px',
  border: hasError ? '1.5px solid #c0392b' : '1px solid #e0dcd8',
  fontSize: '13px', fontFamily: "'Montserrat', sans-serif",
  background: '#fff', color: '#0a0a0a', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
});

const btnPrimary: React.CSSProperties = {
  flex: 1, padding: '14px', background: DARK, color: '#fff', border: 'none',
  fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700,
  letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  flex: 1, padding: '14px', background: '#fff', color: '#555',
  border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif",
  fontSize: '10px', fontWeight: 600, letterSpacing: '2px',
  textTransform: 'uppercase', cursor: 'pointer',
};

const fieldLabel: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase', color: '#888',
  display: 'block', marginBottom: '8px',
};

const errMsg: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif", fontSize: '11px',
  color: '#c0392b', marginTop: '5px',
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartContext();
  const { user, isLoggedIn } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [showPromoLoginModal, setShowPromoLoginModal] = useState(false);

  const [shippingData, setShippingData] = useState({
    customer_first_name: '', customer_last_name: '', customer_email: '',
    customer_phone: '', street_address: '', city: '', province: '', postal_code: '',
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      setShippingData(prev => ({
        ...prev,
        customer_first_name: user.first_name || '',
        customer_last_name: user.last_name || '',
        customer_email: user.email || '',
        customer_phone: user.phone || prev.customer_phone,
      }));
    }
  }, [isLoggedIn, user]);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  useEffect(() => {
    if (!isLoggedIn) return;
    api.get('/addresses').then(res => {
      const list: any[] = res.data.data ?? res.data ?? [];
      setSavedAddresses(list);
      const def = list.find(a => a.is_default) || list[0];
      if (def) applyAddress(def);
    }).catch(() => {});
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyAddress = (addr: any) => {
    setShippingData(prev => ({
      ...prev,
      street_address: addr.street_address || addr.address_line1 || '',
      city: addr.city || '',
      province: addr.state || addr.province || '',
      postal_code: addr.postal_code || '',
    }));
  };

  const [shippingErrors, setShippingErrors] = useState<Record<string, boolean>>({});
  const [billingData, setBillingData] = useState({ sameAsShipping: true, street_address: '', city: '', province: '', postal_code: '' });
  const [billingErrors, setBillingErrors] = useState<Record<string, boolean>>({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNumber, setOrderNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const subtotal = total;
  const tax_amount = 0;
  const shipping_amount = 300;
  const finalTotal = subtotal - promoDiscount + shipping_amount;

  const handleApplyPromo = async () => {
    setPromoError('');
    const code = promoCode.toUpperCase().trim();
    if (!code) { setPromoError('Please enter a promo code'); return; }
    if (appliedPromoCode && code === appliedPromoCode) { setPromoError('Already applied'); return; }
    try {
      const res = await api.get('/promotions/active');
      const promotions: any[] = res.data.data ?? [];
      const match = promotions.find((p: any) => p.name?.toUpperCase() === code || p.code?.toUpperCase() === code);
      if (match) {
        if (match.requires_login && !isLoggedIn) { setShowPromoLoginModal(true); return; }
        let discount = 0;
        if (match.discount_type === 'percentage') {
          discount = subtotal * (Number(match.discount_value) / 100);
          if (match.max_discount_amount) discount = Math.min(discount, Number(match.max_discount_amount));
        } else if (match.discount_type === 'fixed') {
          discount = Number(match.discount_value);
        }
        if (Number(match.min_purchase_amount) > 0 && subtotal < Number(match.min_purchase_amount)) {
          setPromoError(`Minimum purchase of PKR ${Number(match.min_purchase_amount).toLocaleString()} required`);
          setPromoDiscount(0);
        } else {
          setPromoDiscount(discount); setAppliedPromoCode(code); setPromoCode('');
        }
      } else { setPromoError('Invalid promo code'); }
    } catch { setPromoError('Could not validate promo code'); }
  };

  const handleRemovePromo = () => { setPromoDiscount(0); setAppliedPromoCode(''); setPromoCode(''); setPromoError(''); };

  const validateShipping = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (!REGEX.name.test(shippingData.customer_first_name)) errors.customer_first_name = true;
    if (shippingData.customer_last_name && !REGEX.name.test(shippingData.customer_last_name)) errors.customer_last_name = true;
    if (!REGEX.email.test(shippingData.customer_email)) errors.customer_email = true;
    if (!REGEX.phone.test(shippingData.customer_phone)) errors.customer_phone = true;
    if (!REGEX.address.test(shippingData.street_address)) errors.street_address = true;
    if (!REGEX.city.test(shippingData.city)) errors.city = true;
    if (!shippingData.province) errors.province = true;
    if (!REGEX.postalCode.test(shippingData.postal_code)) errors.postal_code = true;
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBilling = (): boolean => {
    if (billingData.sameAsShipping) return true;
    const errors: Record<string, boolean> = {};
    if (!REGEX.address.test(billingData.street_address)) errors.street_address = true;
    if (!REGEX.city.test(billingData.city)) errors.city = true;
    if (!billingData.province) errors.province = true;
    if (!REGEX.postalCode.test(billingData.postal_code)) errors.postal_code = true;
    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validateShipping()) setCurrentStep('billing'); };
  const handleBillingSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validateBilling()) setCurrentStep('payment'); };

  const placeOrder = async () => {
    setOrderError(''); setOrderLoading(true);
    const orderPayload: any = {
      customer_email: shippingData.customer_email,
      customer_phone: shippingData.customer_phone,
      customer_first_name: shippingData.customer_first_name,
      customer_last_name: shippingData.customer_last_name || undefined,
      items: items.map(item => ({ product_id: item.product_id, product_name: item.product_name, sku: item.sku, product_size: item.product_size, quantity: item.quantity, unit_price: item.unit_price })),
      shipping_address: { street_address: shippingData.street_address, city: shippingData.city, province: shippingData.province, postal_code: shippingData.postal_code, phone: shippingData.customer_phone },
      billing_address: billingData.sameAsShipping ? undefined : { street_address: billingData.street_address, city: billingData.city, province: billingData.province, postal_code: billingData.postal_code },
      tax_amount: Math.round(tax_amount), shipping_amount,
      discount_amount: Math.round(promoDiscount), payment_method: paymentMethod,
    };
    if (user?.id) orderPayload.customer_id = user.id;
    try {
      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data.data ?? res.data;
      setOrderNumber(createdOrder.order_number || createdOrder.id);
      clearCart(); setCurrentStep('confirmation');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setOrderError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to place order. Please try again.'));
    } finally { setOrderLoading(false); }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggedIn) { placeOrder(); } else {
      setOtpSending(true);
      try {
        await api.post('/auth/checkout-otp', { email: shippingData.customer_email, name: shippingData.customer_first_name });
        setCurrentStep('email-confirmation');
      } catch { setOrderError('Failed to send verification code. Please try again.'); }
      finally { setOtpSending(false); }
    }
  };

  const handleEmailConfirmation = async () => {
    setOtpSending(true);
    try {
      await api.post('/auth/checkout-otp', { email: shippingData.customer_email, name: shippingData.customer_first_name });
      setOtpSent(true); setOtp(''); setOtpError('');
    } catch { setOtpError('Failed to resend code. Please try again.'); }
    finally { setOtpSending(false); }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) { setOtpError('Please enter the 6-digit code.'); return; }
    try {
      const res = await api.post('/auth/verify-checkout-otp', { email: shippingData.customer_email, otp });
      if (res.data?.data?.valid || res.data?.valid) { placeOrder(); }
      else { setOtpError('Incorrect code. Please try again.'); }
    } catch { setOtpError('Verification failed. Please try again.'); }
  };

  const STEPS: { key: CheckoutStep; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'billing', label: 'Billing' },
    { key: 'payment', label: 'Payment' },
    { key: 'email-confirmation', label: 'Confirm' },
    { key: 'confirmation', label: 'Done' },
  ];
  const activeIdx = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div style={{ background: CREAM, color: '#0a0a0a', minHeight: '100vh' }}>

      {/* ─── Promo Login Modal ─── */}
      {showPromoLoginModal && (
        <>
          <div onClick={() => setShowPromoLoginModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', zIndex: 501, width: '100%', maxWidth: '420px', padding: '52px 44px', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '52px', height: '52px', background: DARK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiLock size={22} color="#fff" strokeWidth={2} />
              </div>
            </div>
            <div style={{ width: '32px', height: '1px', background: GOLD, margin: '0 auto 20px' }} />
            <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.8rem', fontWeight: 600, fontStyle: 'italic', textAlign: 'center', marginBottom: '12px', letterSpacing: '-0.3px' }}>Members Only</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', textAlign: 'center', lineHeight: 1.8, marginBottom: '32px', fontWeight: 300 }}>
              This promo code is exclusively available to registered members. Sign in to unlock this discount.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { window.location.href = '/signin'; }} style={{ ...btnPrimary, flex: 'none' }}>Sign In to Apply Discount</button>
              <button onClick={() => setShowPromoLoginModal(false)} style={{ ...btnSecondary, flex: 'none' }}>Continue Without Discount</button>
            </div>
          </div>
        </>
      )}

      <PageHeader />

      <section style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: 'clamp(20px,5vw,80px)', paddingRight: 'clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* ─── Page Title ─── */}
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>Secure Checkout</p>
            <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Complete Your Order
            </h1>
          </div>

          {items.length === 0 && currentStep !== 'confirmation' ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: '1px', height: '48px', background: GOLD, margin: '0 auto 28px' }} />
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.4rem', fontStyle: 'italic', color: '#888', marginBottom: '32px' }}>Your cart is empty</p>
              <a href="/products" style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none', padding: '14px 40px' }}>Explore Collection</a>
            </div>
          ) : (
            <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: currentStep === 'confirmation' ? '1fr' : '1.5fr 1fr', gap: '60px' }}>

              {/* ─── Main Form ─── */}
              <div>

                {/* Progress Steps */}
                {currentStep !== 'confirmation' && (
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '52px', gap: 0 }}>
                    {STEPS.filter(s => s.key !== 'confirmation').map((step, idx) => {
                      const done = idx < activeIdx;
                      const active = idx === activeIdx;
                      return (
                        <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: idx < 3 ? 1 : 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              background: active ? DARK : done ? GOLD : 'transparent',
                              border: active ? `2px solid ${DARK}` : done ? `2px solid ${GOLD}` : '1px solid #d0ccc8',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 700,
                              color: active ? '#fff' : done ? '#fff' : '#bbb', flexShrink: 0,
                            }}>
                              {done ? '✓' : idx + 1}
                            </div>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: active ? DARK : done ? GOLD : '#bbb', whiteSpace: 'nowrap' }}>
                              {step.label}
                            </span>
                          </div>
                          {idx < 3 && <div style={{ flex: 1, height: '1px', background: done ? GOLD : '#e0dcd8', margin: '0 8px', marginBottom: '24px' }} />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ─── Shipping Form ─── */}
                {currentStep === 'shipping' && (
                  <form onSubmit={handleShippingSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                      <div style={{ width: '24px', height: '1px', background: GOLD }} />
                      <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.6rem', fontWeight: 600, fontStyle: 'italic' }}>Shipping Address</h2>
                    </div>

                    {savedAddresses.length > 0 && (
                      <div style={{ marginBottom: '28px' }}>
                        <label style={fieldLabel}>Saved Addresses</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {savedAddresses.map(addr => (
                            <button key={addr.id} type="button" onClick={() => applyAddress(addr)}
                              style={{ textAlign: 'left', padding: '12px 16px', border: '1px solid #e0dcd8', background: '#fff', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}>
                              <span style={{ fontWeight: 600 }}>{addr.label || 'Saved Address'}</span>
                              {addr.is_default && <span style={{ marginLeft: '8px', fontSize: '9px', background: DARK, color: '#fff', padding: '2px 6px', letterSpacing: '1px' }}>DEFAULT</span>}
                              <br /><span style={{ color: '#888', fontWeight: 300 }}>{[addr.street_address || addr.address_line1, addr.city, addr.state || addr.province].filter(Boolean).join(', ')}</span>
                            </button>
                          ))}
                        </div>
                        <div style={{ height: '1px', background: '#f0ece8', margin: '20px 0' }} />
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                      <div>
                        <label style={fieldLabel}>First Name *</label>
                        <input type="text" placeholder="Aisha" value={shippingData.customer_first_name}
                          onChange={e => setShippingData({ ...shippingData, customer_first_name: e.target.value })}
                          style={inp(!!shippingErrors.customer_first_name)} />
                        {shippingErrors.customer_first_name && <p style={errMsg}>Valid name required</p>}
                      </div>
                      <div>
                        <label style={fieldLabel}>Last Name</label>
                        <input type="text" placeholder="Khan" value={shippingData.customer_last_name}
                          onChange={e => setShippingData({ ...shippingData, customer_last_name: e.target.value })}
                          style={inp(!!shippingErrors.customer_last_name)} />
                        {shippingErrors.customer_last_name && <p style={errMsg}>Valid name required</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={fieldLabel}>Email *</label>
                        <input type="email" placeholder="you@example.com" value={shippingData.customer_email}
                          onChange={e => setShippingData({ ...shippingData, customer_email: e.target.value })}
                          style={inp(!!shippingErrors.customer_email)} />
                        {shippingErrors.customer_email && <p style={errMsg}>Valid email required</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={fieldLabel}>Phone *</label>
                        <div style={{ display: 'flex', border: shippingErrors.customer_phone ? '1.5px solid #c0392b' : '1px solid #e0dcd8', background: '#fff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', borderRight: '1px solid #f0ece8', flexShrink: 0 }}>
                            <img src="https://flagcdn.com/w20/pk.png" srcSet="https://flagcdn.com/w40/pk.png 2x" width="20" height="14" alt="PK" style={{ objectFit: 'cover' }} />
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#555', fontWeight: 500 }}>+92</span>
                          </div>
                          <input type="tel" placeholder="3001234567" value={shippingData.customer_phone}
                            onChange={e => setShippingData({ ...shippingData, customer_phone: e.target.value })}
                            style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 14px', fontSize: '13px', fontFamily: "'Montserrat', sans-serif", background: 'transparent' }} />
                        </div>
                        {shippingErrors.customer_phone && <p style={errMsg}>Valid phone required (10–15 digits)</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={fieldLabel}>Street Address *</label>
                        <input type="text" placeholder="House no, Street, Block..." value={shippingData.street_address}
                          onChange={e => setShippingData({ ...shippingData, street_address: e.target.value })}
                          style={inp(!!shippingErrors.street_address)} />
                        {shippingErrors.street_address && <p style={errMsg}>Valid address required</p>}
                      </div>
                      <div>
                        <label style={fieldLabel}>City *</label>
                        <input type="text" placeholder="Karachi" value={shippingData.city}
                          onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                          style={inp(!!shippingErrors.city)} />
                        {shippingErrors.city && <p style={errMsg}>Valid city required</p>}
                      </div>
                      <div>
                        <label style={fieldLabel}>Province *</label>
                        <select value={shippingData.province} onChange={e => setShippingData({ ...shippingData, province: e.target.value })}
                          style={{ ...inp(!!shippingErrors.province), cursor: 'pointer' }}>
                          <option value="">Select Province</option>
                          {PAKISTAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {shippingErrors.province && <p style={errMsg}>Province required</p>}
                      </div>
                      <div>
                        <label style={fieldLabel}>Postal Code *</label>
                        <input type="text" placeholder="75500" value={shippingData.postal_code}
                          onChange={e => setShippingData({ ...shippingData, postal_code: e.target.value })}
                          style={inp(!!shippingErrors.postal_code)} />
                        {shippingErrors.postal_code && <p style={errMsg}>Valid postal code (5–6 digits)</p>}
                      </div>
                    </div>
                    <button type="submit" style={btnPrimary}>Continue to Billing →</button>
                  </form>
                )}

                {/* ─── Billing Form ─── */}
                {currentStep === 'billing' && (
                  <form onSubmit={handleBillingSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                      <div style={{ width: '24px', height: '1px', background: GOLD }} />
                      <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.6rem', fontWeight: 600, fontStyle: 'italic' }}>Billing Address</h2>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#555' }}>
                      <input type="checkbox" checked={billingData.sameAsShipping} onChange={e => setBillingData({ ...billingData, sameAsShipping: e.target.checked })} style={{ cursor: 'pointer', accentColor: DARK }} />
                      Same as shipping address
                    </label>
                    {!billingData.sameAsShipping && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={fieldLabel}>Street Address *</label>
                          <input type="text" placeholder="House no, Street..." value={billingData.street_address}
                            onChange={e => setBillingData({ ...billingData, street_address: e.target.value })}
                            style={inp(!!billingErrors.street_address)} />
                          {billingErrors.street_address && <p style={errMsg}>Valid address required</p>}
                        </div>
                        <div>
                          <label style={fieldLabel}>City *</label>
                          <input type="text" placeholder="City" value={billingData.city}
                            onChange={e => setBillingData({ ...billingData, city: e.target.value })}
                            style={inp(!!billingErrors.city)} />
                          {billingErrors.city && <p style={errMsg}>Valid city required</p>}
                        </div>
                        <div>
                          <label style={fieldLabel}>Province *</label>
                          <select value={billingData.province} onChange={e => setBillingData({ ...billingData, province: e.target.value })}
                            style={{ ...inp(!!billingErrors.province), cursor: 'pointer' }}>
                            <option value="">Select Province</option>
                            {PAKISTAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          {billingErrors.province && <p style={errMsg}>Province required</p>}
                        </div>
                        <div>
                          <label style={fieldLabel}>Postal Code *</label>
                          <input type="text" placeholder="75500" value={billingData.postal_code}
                            onChange={e => setBillingData({ ...billingData, postal_code: e.target.value })}
                            style={inp(!!billingErrors.postal_code)} />
                          {billingErrors.postal_code && <p style={errMsg}>Valid postal code</p>}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={() => setCurrentStep('shipping')} style={btnSecondary}>← Back</button>
                      <button type="submit" style={btnPrimary}>Continue to Payment →</button>
                    </div>
                  </form>
                )}

                {/* ─── Payment Form ─── */}
                {currentStep === 'payment' && (
                  <form onSubmit={handlePaymentSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                      <div style={{ width: '24px', height: '1px', background: GOLD }} />
                      <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.6rem', fontWeight: 600, fontStyle: 'italic' }}>Payment Method</h2>
                    </div>
                    <div style={{ marginBottom: '28px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px 20px', border: `1.5px solid ${DARK}`, background: '#fff', cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} style={{ marginTop: '2px', accentColor: DARK, cursor: 'pointer' }} />
                        <div>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>Cash on Delivery</p>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', margin: 0, fontWeight: 300 }}>Pay when your order arrives at your door</p>
                        </div>
                      </label>
                    </div>
                    {!isLoggedIn && (
                      <div style={{ padding: '14px 18px', borderLeft: `3px solid ${GOLD}`, background: '#fffbf2', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#7a5c1a', marginBottom: '20px', lineHeight: 1.7, fontWeight: 300 }}>
                        <strong style={{ fontWeight: 600 }}>Ordering as a guest?</strong> Exchange requests are only available for registered accounts.{' '}
                        <a href="/signin" style={{ color: GOLD, textDecoration: 'underline' }}>Sign in</a> or <a href="/register" style={{ color: GOLD, textDecoration: 'underline' }}>register</a> to protect your order.
                      </div>
                    )}
                    {orderError && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', marginBottom: '16px', textAlign: 'center' }}>{orderError}</p>}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={() => setCurrentStep('billing')} style={btnSecondary}>← Back</button>
                      <button type="submit" disabled={orderLoading} style={{ ...btnPrimary, opacity: orderLoading ? 0.6 : 1, cursor: orderLoading ? 'not-allowed' : 'pointer' }}>
                        {orderLoading ? 'Placing Order…' : isLoggedIn ? 'Confirm Order' : 'Place Order'}
                      </button>
                    </div>
                  </form>
                )}

                {/* ─── Email Confirmation (OTP) ─── */}
                {currentStep === 'email-confirmation' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                      <div style={{ width: '24px', height: '1px', background: GOLD }} />
                      <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.6rem', fontWeight: 600, fontStyle: 'italic' }}>Verify Your Email</h2>
                    </div>
                    {!otpSent ? (
                      <div style={{ paddingTop: '20px' }}>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', marginBottom: '32px', lineHeight: 1.8, fontWeight: 300 }}>
                          We'll send a verification code to<br />
                          <strong style={{ fontWeight: 600, color: '#0a0a0a' }}>{shippingData.customer_email}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button type="button" onClick={() => setCurrentStep('payment')} style={btnSecondary}>← Back</button>
                          <button type="button" onClick={handleEmailConfirmation} style={btnPrimary}>Send OTP</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', marginBottom: '28px', lineHeight: 1.8, fontWeight: 300 }}>
                          We've sent a 6-digit code to <strong style={{ fontWeight: 600, color: '#0a0a0a' }}>{shippingData.customer_email}</strong>
                        </p>
                        <div style={{ marginBottom: '24px' }}>
                          <label style={fieldLabel}>Verification Code</label>
                          <input type="text" placeholder="— — — — — —" value={otp}
                            onChange={e => { setOtp(e.target.value.slice(0, 6)); setOtpError(''); }}
                            maxLength={6}
                            style={{ ...inp(!!otpError), fontSize: '22px', textAlign: 'center', letterSpacing: '10px', fontFamily: 'monospace' }} />
                          {otpError && <p style={errMsg}>{otpError}</p>}
                        </div>
                        {orderError && <div style={{ padding: '12px 16px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', marginBottom: '16px' }}>{orderError}</div>}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button type="button" onClick={handleEmailConfirmation} disabled={otpSending} style={{ ...btnSecondary, opacity: otpSending ? 0.6 : 1 }}>Resend OTP</button>
                          <button type="button" onClick={handleOtpVerification} disabled={otp.length !== 6}
                            style={{ ...btnPrimary, opacity: otp.length !== 6 ? 0.4 : 1, cursor: otp.length !== 6 ? 'not-allowed' : 'pointer' }}>
                            Verify & Place Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── Confirmation ─── */}
                {currentStep === 'confirmation' && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                      <div style={{ width: '56px', height: '56px', border: `1.5px solid ${GOLD}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '12px', fontWeight: 600 }}>Order Confirmed</p>
                      <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600, fontStyle: 'italic', marginBottom: '16px', letterSpacing: '-0.5px' }}>
                        Thank You!
                      </h2>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 300 }}>Your order number:</p>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '24px', color: DARK }}>{orderNumber}</p>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', marginBottom: '40px', lineHeight: 1.8, fontWeight: 300 }}>
                        A confirmation email has been sent to <strong style={{ color: '#555', fontWeight: 500 }}>{shippingData.customer_email}</strong>.
                      </p>
                      <a href="/products" style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none', padding: '14px 48px' }}>Continue Shopping</a>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── Order Summary Sidebar ─── */}
              {currentStep !== 'confirmation' && (
                <div style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e8e4e0', padding: '36px' }}>
                    <div style={{ width: '32px', height: '1px', background: GOLD, marginBottom: '24px' }} />
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '24px' }}>Order Summary</h3>

                    <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0ece8' }}>
                      {items.map(item => (
                        <div key={`${item.product_id}-${item.product_size}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
                          <span style={{ fontFamily: "'Cormorant', serif", fontSize: '14px', fontStyle: 'italic', color: '#555' }}>{item.product_name} ×{item.quantity}</span>
                          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>PKR {(item.unit_price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code */}
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0ece8' }}>
                      <label style={fieldLabel}>Promo Code</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                          placeholder="Enter code"
                          style={{ ...inp(!!promoError), flex: 1, padding: '10px 12px' }} />
                        <button onClick={handleApplyPromo}
                          style={{ padding: '10px 14px', background: DARK, color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Apply
                        </button>
                      </div>
                      {promoError && <p style={errMsg}>{promoError}</p>}
                      {appliedPromoCode && (
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px dashed #1a7a4a', background: '#f0fdf4' }}>
                          <div>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 700, color: '#1a7a4a', letterSpacing: '1px' }}>{appliedPromoCode}</span>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#1a7a4a', marginLeft: '8px' }}>−PKR {Math.round(promoDiscount).toLocaleString()}</span>
                          </div>
                          <button onClick={handleRemovePromo} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a7a4a', fontSize: '16px', padding: 0, lineHeight: 1 }}>×</button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', fontWeight: 300 }}>Subtotal</span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500 }}>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', fontWeight: 300 }}>Shipping</span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500 }}>PKR {shipping_amount.toLocaleString()}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#1a7a4a', fontWeight: 300 }}>Discount</span>
                        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500, color: '#1a7a4a' }}>−PKR {Math.round(promoDiscount).toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0ece8', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 600 }}>Total</span>
                      <span style={{ fontFamily: "'Cormorant', serif", fontSize: '1.4rem', fontWeight: 600, fontStyle: 'italic' }}>PKR {Math.round(finalTotal).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
