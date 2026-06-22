import React, { useState, useEffect } from 'react';

export function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    document.head.appendChild(link);
    const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
    setOrders(savedOrders);

    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">История моих заказов</h2>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          {orders.length === 0 ? (
            <div className="text-center text-muted p-5 border rounded">У вас пока нет заказов.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map((order) => (
                <div key={order.id} className="p-3 border shadow-sm" style={{ borderRadius: '15px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Заказ #{String(order.id).slice(-4)}</h6>
                      <small className="text-muted">Дата: {order.date || '---'}</small>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold d-block fs-5">
                        ${Number(order.total || 0).toFixed(2)}
                      </span>
                      <small className="text-muted">Товаров: {order.count || 0}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;