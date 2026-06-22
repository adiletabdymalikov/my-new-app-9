import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Walmart() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState([]);
  

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    axios.get('https://fakestoreapi.noksha.dev/api/walmartproducts')
      .then((res) => {
        const rawData = res.data.data || res.data || [];
        setProducts(rawData);
        setFiltered(rawData);
      })
      .catch(err => console.error("Ошибка Walmart:", err));
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const query = text.toLowerCase().trim();
    setFiltered(products.filter(item => item.title?.toLowerCase().includes(query)));
  };

  const addToCart = (product) => {
    const id = product._id || product.id;
    const isExist = cart.some(item => (item._id || item.id) === id);
    setCart(isExist 
      ? cart.map(item => (item._id || item.id) === id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }]
    );
  };

  const removeFromCart = (productId) => {
    const target = cart.find(item => (item._id || item.id) === productId);
    setCart(target?.quantity === 1 
      ? cart.filter(item => (item._id || item.id) !== productId)
      : cart.map(item => (item._id || item.id) === productId ? { ...item, quantity: item.quantity - 1 } : item)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!cart.length) return;

    const newOrder = {
      id: Date.now(), 
      date: new Date().toLocaleDateString('ru-RU'),
      total: cartTotal, 
      count: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
    const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
    const updatedOrders = [newOrder, ...savedOrders];
    localStorage.setItem('my_orders', JSON.stringify(updatedOrders));
  
    setCart([]); 
    alert("Заказ успешно оформлен!");
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center fw-bold mb-3">Walmart Store</h2>
      
      <div className="mx-auto mb-4" style={{ maxWidth: '400px' }}>
        <input 
          type="text" className="form-control p-2 text-center" placeholder="Search Walmart product" 
          value={searchText} onChange={(e) => handleSearch(e.target.value)} style={{ borderRadius: '10px' }}
        />
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="row g-3">
            {filtered.map(item => (
              <div key={item._id || item.id} className="col-sm-6 col-md-4">
                <div className="card h-100 p-2 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <button className="btn btn-dark position-absolute rounded-circle" style={{ top: '15px', right: '15px', width: '32px', height: '32px', padding: 0, zIndex: 2 }} onClick={() => addToCart(item)}>+</button>
                  <img src={item.image || 'https://via.placeholder.com/180'} className="card-img-top rounded" style={{ height: '180px', objectFit: 'contain', background: '#fff' }} alt={item.title} />
                  <div className="card-body px-1 py-2 d-flex justify-content-between align-items-center">
                    <div className="text-truncate me-2" style={{ maxWidth: '70%' }}>
                      <span className="text-dark small d-block text-truncate">{item.title}</span>
                    </div>
                    <span className="fw-bold">${item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 border shadow-sm mb-4" style={{ borderRadius: '15px' }}>
            <h4 className="fw-normal border-bottom pb-2">My Order</h4>
            {cart.length === 0 ? <p className="text-muted small my-3">Cart is empty.</p> : (
              <>
                {cart.map(item => (
                  <div key={item._id || item.id} className="d-flex justify-content-between align-items-center my-3">
                    <span className="small text-truncate" style={{ maxWidth: '140px' }}>{item.title}</span>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-light py-0" onClick={() => removeFromCart(item._id || item.id)}>-</button>
                      <span className="small fw-bold">{item.quantity}</span>
                      <button className="btn btn-sm btn-light py-0" onClick={() => addToCart(item)}>+</button>
                      <span className="small fw-bold ms-2">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-3">
                  <span className="text-muted">Total:</span>
                  <span className="fs-5 fw-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-dark w-100 mt-3" onClick={handleCheckout}>Checkout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Walmart;