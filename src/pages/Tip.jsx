import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 

export function Tip() {
  const [products, setProducts] = useState([]); 
  const [searchResults, setSearchResults] = useState([]); 
  const [searchText, setSearchText] = useState(''); 
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://api.escuelajs.co/api/v1/products';

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка при загрузке API:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    
    const filtered = products.filter(item => 
      item.title && item.title.toLowerCase().includes(text.toLowerCase())
    );

    setSearchResults(filtered);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Поиск по Platzi Fake API</h3>
        
      
        <div className="mb-3">
          <label className="form-label">Начните вводить название товара (например: Shoes, Clothes, Chair):</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Поиск товара..." 
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={loading}
          />
          {loading && <small className="text-muted">Загрузка базы данных API...</small>}
        </div>

      
        <div className="search-results mt-3">
          {searchResults.length > 0 ? (
            <ul className="list-group">
              {searchResults.map(item => (
                <li key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                   
                    <img 
                      src={item.images && item.images[0]} 
                      alt={item.title} 
                      className="rounded me-3" 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }} 
                    />
                    <div>
                      <h6 className="mb-0">{item.title}</h6>
                      <small className="text-muted">Категория: {item.category?.name}</small>
                    </div>
                  </div>
                  <span className="badge bg-primary rounded-pill">${item.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            searchText.trim() !== '' && <p className="text-center text-muted mt-3">Ничего не найдено</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Tip;