import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

export function Tip() {
  const [users, setUsers] = useState([]); 
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState(''); 
  const [loading, setLoading] = useState(true);
  const API_URL = 'https://api.escuelajs.co/api/v1/users';

  useEffect(() => {
    axios.get(API_URL) 
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка при загрузке API пользователей:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = users.filter(user => 
      user.name && user.name.toLowerCase().includes(text.toLowerCase())
    );

    setSearchResults(filtered);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Поиск пользователей Platzi API</h3>
        
        <div className="mb-3">
          <label className="form-label">Введите имя пользователя (например: Jhon, Maria):</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Поиск по имени..." 
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={loading}
          />
          {loading && <small className="text-muted">Загрузка списка пользователей...</small>}
        </div>

        <div className="search-results mt-3">
          {searchResults.length > 0 ? (
            <ul className="list-group">
              {searchResults.map(user => (
                <li key={user.id} className="list-group-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                   
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="rounded-circle me-3" 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }} 
                    />
                    <div>
                      <h6 className="mb-0">{user.name}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                  <span className="badge bg-info text-dark rounded-pill">{user.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            searchText.trim() !== '' && <p className="text-center text-muted mt-3">Пользователь не найден</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tip;