import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
export function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://fakestoreapi.noksha.dev/api/comments")
      .then((res) => {
        setComments(res.data.data || res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <Link to="/" className="btn btn-outline-secondary me-3">← Назад</Link>
        <h2 className="fw-bold m-0">Отзывы покупателей</h2>
      </div>

      {loading ? (
        <div className="text-center py-5">Загрузка...</div>
      ) : (
        <div className="row g-4 justify-content-center">
          {comments.map((c) => (
            <div key={c.id || Math.random()} className="col-12 col-md-8">
              <div className="card shadow-sm border-0 rounded-4 p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                       style={{ width: '45px', height: '45px' }}>
                    {c.name ? c.name[0].toUpperCase() : 'A'}
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-bold">{c.name || "Аноним"}</h6>
                    <small className="text-muted">{c.email}</small>
                  </div>
                </div>
                <p className="text-secondary mb-0">"{c.body}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}