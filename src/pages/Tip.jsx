import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

export function Tip() {
  const [products, setProducts] = useState([]);      
  const [filtered, setFiltered] = useState([]);       
  const [searchText, setSearchText] = useState('');   
  const [cart, setCart] = useState([]);             
  const [orders, setOrders] = useState([]);          


  useEffect(() => {
    axios.get('https://api.escuelajs.co/api/v1/products') 
      .then(response => {
        setProducts(response.data);
        setFiltered(response.data); 
      })
      .catch(err => console.error("Ошибка при загрузке:", err));
  }, []);

  
  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFiltered(products); 
      return;
    }

    
    const searchResult = products.filter(item => 
      item.title && item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(searchResult);
  };

  const addToCart = (product) => {
    const itemInCart = cart.find(item => item.id === product.id);
    if (itemInCart) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  
  const removeFromCart = (productId) => {
    const itemInCart = cart.find(item => item.id === productId);
    if (itemInCart.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
  };
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: orders.length + 1,
      date: '28.05.26', 
      total: cartTotal,
      count: cart.reduce((sum, item) => sum + item.quantity, 0)
    };

    setOrders([newOrder, ...orders]); 
    setCart([]); 
  };

  return (
    <div className="container-fluid mt-4">
   
      <h2 className="text-center fw-bold mb-3">Shopi</h2>
      <div className="mx-auto mb-5" style={{ maxWidth: '400px' }}>
        <input 
          type="text" 
          className="form-control p-2 text-center" 
          placeholder="Search a product" 
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ borderRadius: '10px' }}
        />
      </div>

      <div className="row">
      
        <div className="col-md-8">
          <h4 className="mb-4">Products</h4>
          
          <div className="row g-3">
            {filtered.length > 0 ? (
              filtered.map(item => (
                <div key={item.id} className="col-sm-6 col-md-4">
                  <div className="card h-100 p-2 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    
                
                    <button 
                      className="btn btn-dark position-absolute rounded-circle" 
                      style={{ top: '15px', right: '15px', width: '32px', height: '32px', padding: 0 }}
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>

                    <img 
                      src={item.images?.[0]} 
                      alt={item.title} 
                      className="card-img-top rounded" 
                      style={{ height: '180px', objectFit: 'cover' }} 
                    />
                    
                    <div className="card-body px-1 py-2 d-flex justify-content-between align-items-center">
                      <span className="text-muted small text-truncate me-2">{item.title}</span>
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
            
            {cart.length === 0 ? (
              <p className="text-muted my-3 small">Your cart is empty.</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center my-3">
                    <span className="small text-truncate" style={{ maxWidth: '140px' }}>{item.title}</span>
                    
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-light py-0" onClick={() => removeFromCart(item.id)}>-</button>
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
            {orders.length === 0 ? (
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