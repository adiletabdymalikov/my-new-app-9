import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

export function Tip() {
  const [products, setProducts] = useState([]);      
  const [categories, setCategories] = useState([]); 
  const [filtered, setFiltered] = useState([]);       
  const [searchText, setSearchText] = useState('');   
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [cart, setCart] = useState([]);             
  const [orders, setOrders] = useState([]);          
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    document.head.appendChild(link);
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
  }, []);
  const applyFilters = (text, categoryName) => {
    const query = (text || '').toLowerCase().trim();
    const result = products
      .filter(item => !categoryName || item.category === categoryName)
      .filter(item => !query || item.title?.toLowerCase().includes(query));
    setFiltered(result);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    applyFilters(text, selectedCategory);
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    applyFilters(searchText, categoryName);
  };

  const addToCart = (product) => {
    const isExist = cart.some(item => (item._id || item.id) === (product._id || product.id));
    setCart(isExist 
      ? cart.map(item => (item._id || item.id) === (product._id || product.id) ? { ...item, quantity: item.quantity + 1 } : item)
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
    setOrders([{
      id: orders.length + 1,
      date: '28.05.26', 
      total: cartTotal,
      count: cart.reduce((sum, item) => sum + item.quantity, 0)
    }, ...orders]); 
    setCart([]); 
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center fw-bold mb-3">Shopi</h2>
      
      <div className="mx-auto mb-4" style={{ maxWidth: '400px' }}>
        <input 
          type="text" 
          className="form-control p-2 text-center" 
          placeholder="Search a product" 
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ borderRadius: '10px' }}
        />
      </div>

      <div className="d-flex justify-content-center gap-2 flex-wrap mb-5">
        <button 
          className={`btn btn-sm ${!selectedCategory ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => handleCategorySelect(null)}
          style={{ borderRadius: '20px', padding: '6px 15px' }}
        >
          All
        </button>
        {categories.map((catName, index) => (
          <button
            key={index}
            className={`btn btn-sm ${selectedCategory === catName ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => handleCategorySelect(catName)}
            style={{ borderRadius: '20px', padding: '6px 15px', textTransform: 'capitalize' }}
          >
            {catName}
          </button>
        ))}
      </div>

      <div className="row">
        <div className="col-md-8">
          <h4 className="mb-4">Products</h4>
          <div className="row g-3">
            {filtered.length ? (
              filtered.map(item => (
                <div key={item._id || item.id} className="col-sm-6 col-md-4">
                  <div className="card h-100 p-2 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <button 
                      className="btn btn-dark position-absolute rounded-circle" 
                      style={{ top: '15px', right: '15px', width: '32px', height: '32px', padding: 0, zIndex: 2 }}
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                    <img 
                      src={Array.isArray(item.images) ? item.images[0] : (item.image || 'https://via.placeholder.com/180')} 
                      alt={item.title} 
                      className="card-img-top rounded" 
                      style={{ height: '180px', objectFit: 'contain', background: '#fff' }} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/180' }}
                    />
                    <div className="card-body px-1 py-2 d-flex justify-content-between align-items-center">
                      <div className="text-truncate me-2" style={{ maxWidth: '70%' }}>
                        <span className="text-dark small d-block text-truncate">{item.title}</span>
                        <span className="text-muted" style={{ fontSize: '10px', textTransform: 'capitalize' }}>{item.category}</span>
                      </div>
                      <span className="fw-bold">${item.price}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted ms-3">No products found...</p>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 border shadow-sm mb-4" style={{ borderRadius: '15px' }}>
            <h4 className="fw-normal border-bottom pb-2">My Order</h4>
            {!cart.length ? (
              <p className="text-muted my-3 small">Your cart is empty.</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item._id || item.id} className="d-flex justify-content-between align-items-center my-3">
                    <span className="small text-truncate" style={{ maxWidth: '140px' }}>{item.title}</span>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-light py-0" onClick={() => removeFromCart(item._id || item.id)}>-</button>
                      <span className="small fw-bold">{item.quantity}</span>
                      <button className="btn btn-sm btn-light py-0" onClick={() => addToCart(item)}>+</button>
                      <span className="small fw-bold ms-2">${item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-3">
                  <span className="text-muted">Total:</span>
                  <span className="fs-5 fw-bold">${cartTotal}</span>
                </div>
                <button className="btn btn-dark w-100 mt-3" onClick={handleCheckout}>Checkout</button>
              </div>
            )}
          </div>

          <div className="card p-3 border shadow-sm" style={{ borderRadius: '15px' }}>
            <h4 className="fw-normal border-bottom pb-2">My Orders</h4>
            {!orders.length ? (
              <p className="text-muted my-2 small">No orders yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2 mt-2">
                {orders.map(order => (
                  <div key={order.id} className="p-2 border rounded d-flex justify-content-between align-items-center" style={{ fontSize: '13px' }}>
                    <div>
                      <div>📅 {order.date}</div>
                      <div className="text-muted">🛍️ {order.count} items</div>
                    </div>
                    <span className="fw-bold fs-6">${order.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tip;