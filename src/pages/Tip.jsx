import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';

export function Tip() {
  const [products, setProducts] = useState([]);      
  const [categories, setCategories] = useState([]); 
  const [filtered, setFiltered] = useState([]);       
  const [searchText, setSearchText] = useState('');   
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [cart, setCart] = useState([]);             
  const [orders, setOrders] = useState([]);         
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => {
    const link = document.createElement('link');
    
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    document.head.appendChild(link);
    const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
    setOrders(savedOrders);

    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    axios.get('https://fakestoreapi.noksha.dev/api/products')
      .then((res) => {
        const rawData = res.data.data || res.data || [];
        setProducts(rawData);
        setFiltered(rawData);
        const uniqueNames = Array.from(new Set(rawData.map(i => i.category).filter(Boolean)));
        setCategories(uniqueNames.slice(0, 6));
      })
      .catch(err => console.error(err));
    axios.get('https://fakestoreapi.noksha.dev/api/coupons')
      .then((res) => setCoupons(res.data.data || res.data || []))
      .catch(err => console.error("Ошибка загрузки купонов", err));
  }, []);

  const handleApplyCoupon = () => {
    const foundCoupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (foundCoupon) {
      setAppliedDiscount(foundCoupon.discount / 100); 
      alert(`Купон применен! Скидка: ${foundCoupon.discount}%`);
    } else {
      alert("Неверный код купона");
    }
  };

  const applyFilters = (text, categoryName) => {
    const query = (text || '').toLowerCase().trim();
    const result = products
      .filter(item => !categoryName || item.category === categoryName)
      .filter(item => !query || item.title?.toLowerCase().includes(query));
    setFiltered(result);
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
  const discountedTotal = (cartTotal * (1 - appliedDiscount)).toFixed(2);

  const handleCheckout = () => {
    if (!cart.length) return;
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      total: discountedTotal,
      count: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
    const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
    localStorage.setItem('my_orders', JSON.stringify([newOrder, ...savedOrders]));
    setOrders([newOrder, ...savedOrders]);
    setCart([]);
    setAppliedDiscount(0);
    setCouponCode('');
    alert("Заказ успешно оформлен!");
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center fw-bold mb-3">Shopi</h2>
      
      <div className="mx-auto mb-4" style={{ maxWidth: '400px' }}>
        <input 
          className="form-control p-2 text-center" 
          placeholder="Search a product" 
          value={searchText}
          onChange={(e) => {setSearchText(e.target.value); applyFilters(e.target.value, selectedCategory)}}
          style={{ borderRadius: '10px' }}
        />
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="row g-3">
            {filtered.map(item => (
              <div key={item._id || item.id} className="col-sm-6 col-md-4">
                <div className="card h-100 p-2 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                  <button className="btn btn-dark position-absolute rounded-circle" style={{ top: '15px', right: '15px', width: '32px', height: '32px', padding: 0, zIndex: 2 }} onClick={() => addToCart(item)}>+</button>
                  <img src={item.image || 'https://via.placeholder.com/180'} className="card-img-top rounded" style={{ height: '180px', objectFit: 'contain' }} alt={item.title} />
                  <div className="card-body px-1 py-2 d-flex justify-content-between align-items-center">
                    <span className="small text-truncate">{item.title}</span>
                    <span className="fw-bold">${item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 border shadow-sm mb-4" style={{ borderRadius: '15px' }}>
            <h4 className="border-bottom pb-2">My Order</h4>
            {cart.map(item => (
              <div key={item._id || item.id} className="d-flex justify-content-between align-items-center my-2">
                <span className="small text-truncate" style={{ maxWidth: '100px' }}>{item.title}</span>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-light py-0" onClick={() => removeFromCart(item._id || item.id)}>-</button>
                  <span className="small fw-bold">{item.quantity}</span>
                  <button className="btn btn-sm btn-light py-0" onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            ))}
            
            <div className="input-group mt-3">
              <input className="form-control form-control-sm" placeholder="Coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <button className="btn btn-sm btn-outline-dark" onClick={handleApplyCoupon}>OK</button>
            </div>
            
            <div className="d-flex justify-content-between mt-3 fw-bold">
              <span>Total:</span>
              <span>${discountedTotal}</span>
            </div>
            <button className="btn btn-dark w-100 mt-2" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tip;