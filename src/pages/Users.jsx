import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://fakestoreapi.noksha.dev/api/users')
      .then((res) => {
        const data = res.data.data || res.data || [];
        setUsers(data);
      })
      .catch((err) => console.error("Ошибка при загрузке пользователей:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">Users Directory</h2>
      
      {loading ? (
        <div className="text-center">Загрузка списка пользователей...</div>
      ) : (
        <div className="row g-3">
          {users.map((user) => (
            <div key={user.id || Math.random()} className="col-md-4">
              <div className="card p-3 shadow-sm border-0 h-100">
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                       style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">{user.name || "Unknown User"}</h6>
                    <small className="text-muted">{user.email}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;