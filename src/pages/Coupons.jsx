import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Coupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    axios.get('https://fakestoreapi.noksha.dev/api/coupons')
      .then((res) => {
        const data = res.data.data || res.data || [];
        setCoupons(data);
      })
      .catch(err => console.error("Ошибка загрузки купонов:", err));
  }, []);
  const selectCoupon = (coupon) => {
    localStorage.setItem('active_coupon', JSON.stringify(coupon));
    alert(`Купон ${coupon.code} выбран! Теперь примените его в магазине.`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">Available Coupons</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {coupons.length === 0 ? (
            <p className="text-center text-muted">No coupons available at the moment.</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {coupons.map((coupon, index) => (
                <div 
                  key={index} 
                  className="card p-3 border-dashed shadow-sm text-center" 
                  style={{ borderRadius: '15px', border: '2px dashed #333', cursor: 'pointer' }}
                  onClick={() => selectCoupon(coupon)} 
                >
                  <h5 className="mb-1 text-uppercase">{coupon.code || "DISCOUNT"}</h5>
                  <p className="text-muted small mb-0">{coupon.description || "Use this code for a discount!"}</p>
                  <small className="text-primary mt-2 d-block">Нажмите, чтобы выбрать</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Coupons;